import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // ========================================
  // Persistent State
  // ========================================
  // Roles and state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent state variables
  var lastCitizenId = 0;
  var totalSuzi = 1_000_000_000;
  var nextWorkLogId = 1;
  var nextDAOProposalId = 1;
  var owner : ?Principal = null;

  // Persistent maps
  let principalToCitizenId = Map.empty<Principal, Nat>();
  let workLogVerifications = Map.empty<Nat, [Principal]>();
  let workLogs = Map.empty<Nat, WorkLog>();
  let daoProposals = Map.empty<Nat, DAOProposal>();
  let daoVotes = Map.empty<Nat, [Nat]>();
  let allBalances = Map.empty<Principal, Nat>();

  // User profiles
  public type UserProfile = {
    name : Text;
  };
  let userProfiles = Map.empty<Principal, UserProfile>();

  // ========================================
  // Types & Modules
  // ========================================
  // Work log types
  public type ValidationStatus = { #pending; #completed };
  public type WorkLogCategory = { #physical; #knowledge; #creative; #wellness };
  public type WorkLogTimeSpan = {
    startTime : Time.Time;
    endTime : Time.Time;
  };

  type WorkLogRaw = {
    id : Nat;
    worker : Principal;
    category : WorkLogCategory;
    description : Text;
    time : WorkLogTimeSpan;
    validations : Nat;
    status : ValidationStatus;
  };

  module WorkLog {
    public func fromRaw(raw : WorkLogRaw) : WorkLog {
      {
        id = raw.id;
        worker = raw.worker;
        category = raw.category;
        description = raw.description;
        time = raw.time;
        validations = raw.validations;
        status = raw.status;
      };
    };

    public func compareByTime(log1 : WorkLog, log2 : WorkLog) : Order.Order {
      if (log1.time.startTime < log2.time.startTime) { #less } else if (log1.time.startTime > log2.time.startTime) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  public type WorkLog = WorkLogRaw;
  public type DAOProposal = {
    id : Nat;
    title : Text;
    description : Text;
    proposer : Principal;
    budget : Nat;
    yesVotes : Nat;
    noVotes : Nat;
    startTime : Time.Time;
  };
  public type VotingStatus = { #pending; #approved; #rejected };

  // ========================================
  // Internal Util Functions
  // ========================================
  func checkValidPrincipalId(caller : Principal) {
    if (Principal.fromText("bx2wj-w4gwx-2fqc7-khufe-dwqgu-xt4im-fdq6d-7o3s7-xem24-clih4-ica") != caller) {
      Runtime.trap("Invalid owner! Please manually replace [INSERT_YOUR_PRINCIPAL_ID_HERE] in owner field");
    };
  };

  func getNewCitizenId() : Nat {
    lastCitizenId += 1;
    lastCitizenId;
  };

  // ========================================
  // User Profile Management
  // ========================================
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin access required");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ========================================
  // Onboarding (Citizens)
  // ========================================
  public shared ({ caller }) func onboardCitizen(citizenPrincipal : Principal) : async () {
    // Only admin can onboard others, or users can self-register
    if (caller != citizenPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can onboard other citizens");
    };

    if (principalToCitizenId.containsKey(citizenPrincipal)) {
      Runtime.trap("Citizen already registered");
    };

    let newId = getNewCitizenId();
    principalToCitizenId.add(citizenPrincipal, newId);
  };

  // ========================================
  // Work Log System (Proof of Contribution)
  // ========================================
  public type NewWorkLog = {
    category : WorkLogCategory;
    description : Text;
    time : WorkLogTimeSpan;
  };

  public shared ({ caller }) func createWorkLog(input : NewWorkLog) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create work logs");
    };

    let logId = nextWorkLogId;
    nextWorkLogId += 1;

    let workLogRaw : WorkLogRaw = {
      id = logId;
      worker = caller;
      category = input.category;
      description = input.description;
      time = input.time;
      validations = 0;
      status = #pending;
    };

    workLogs.add(logId, workLogRaw);
    logId;
  };

  func hasVerified(verifications : [Principal], principal : Principal) : Bool {
    for (verification in verifications.values()) {
      if (verification == principal) {
        return true;
      };
    };
    false;
  };

  public shared ({ caller }) func validateWorkLog(workLogId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can validate work logs");
    };

    let workLog = switch (workLogs.get(workLogId)) {
      case (null) { Runtime.trap("Invalid work log ID") };
      case (?log) { log };
    };

    if (caller == workLog.worker) {
      Runtime.trap("Cannot validate own work log");
    };

    let currentVerifications : [Principal] = switch (workLogVerifications.get(workLogId)) {
      case (null) {
        let newVerifications = [caller];
        workLogVerifications.add(workLogId, newVerifications);
        workLogs.add(
          workLogId,
          {
            workLog with
            validations = 1;
            status = #pending;
          },
        );
        return ();
      };
      case (?existingVerifications) { existingVerifications };
    };

    if (hasVerified(currentVerifications, caller)) {
      Runtime.trap("Cannot validate twice");
    };

    let updatedVerifications = currentVerifications.concat([caller]);
    workLogVerifications.add(workLogId, updatedVerifications);

    if (updatedVerifications.size() >= 2) {
      // Mark as completed and transfer reward
      workLogs.add(
        workLogId,
        {
          workLog with
          status = #completed;
          validations = updatedVerifications.size();
        },
      );

      // Transfer reward to worker (simplified: 100 SUZI per completed work log)
      let rewardAmount = 100;
      let workerBalance = switch (allBalances.get(workLog.worker)) {
        case (null) { 0 };
        case (?balance) { balance };
      };
      allBalances.add(workLog.worker, workerBalance + rewardAmount);
    } else {
      workLogs.add(
        workLogId,
        {
          workLog with
          validations = updatedVerifications.size();
          status = #pending;
        },
      );
    };
  };

  // ========================================
  // Token Distribution & Balance Management
  // ========================================
  public shared ({ caller }) func bulkAirdrop(recipients : [Principal], amount : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform bulk airdrops");
    };

    for (recipient in recipients.values()) {
      let currentBalance = switch (allBalances.get(recipient)) {
        case (null) { 0 };
        case (?balance) { balance };
      };
      allBalances.add(recipient, currentBalance + amount);
    };
  };

  // ========================================
  // Token ICRC Interface (Main)
  // ========================================
  public shared ({ caller }) func transfer(to : Principal, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can transfer tokens");
    };

    let callerBalance = switch (allBalances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };

    if (amount > callerBalance) {
      Runtime.trap("Insufficient balance");
    };

    allBalances.add(caller, callerBalance - amount);

    // Add to recipient
    let recipientBalance = switch (allBalances.get(to)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
    allBalances.add(to, recipientBalance + amount);
  };

  // ========================================
  // DAO System
  // ========================================
  public shared ({ caller }) func submitProposal(title : Text, description : Text, budget : Nat, startTime : Time.Time) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit proposals");
    };

    let proposalId = nextDAOProposalId;
    nextDAOProposalId += 1;

    let proposal : DAOProposal = {
      id = proposalId;
      title;
      description;
      proposer = caller;
      budget;
      yesVotes = 0;
      noVotes = 0;
      startTime;
    };

    daoProposals.add(proposalId, proposal);
    proposalId;
  };

  public query ({ caller }) func getVotingStatus(_ : Nat) : async VotingStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view voting status");
    };
    #pending;
  };

  // ========================================
  // Query Functions (Persistent State)
  // ========================================
  public query ({ caller }) func getWorkLogsByCategory(category : WorkLogCategory) : async [WorkLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view work logs");
    };

    let filtered = workLogs.values().filter(
      func(log) { log.category == category }
    );
    let mapped = filtered.map(func(raw) { WorkLog.fromRaw(raw) });
    mapped.toArray();
  };

  public query ({ caller }) func getAllWorkLogs() : async [WorkLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view work logs");
    };

    let mapped = workLogs.values().map(func(raw) { WorkLog.fromRaw(raw) });
    mapped.toArray();
  };

  public query ({ caller }) func getCitizenIdByPrincipal(principal : Principal) : async Nat {
    // Allow self-lookup or admin access
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own citizen ID or admin access required");
    };

    switch (principalToCitizenId.get(principal)) {
      case (null) { Runtime.trap("Citizen not found") };
      case (?id) { id };
    };
  };

  public query ({ caller }) func getBalance(principal : Principal) : async Nat {
    // Allow self-lookup or admin access
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own balance or admin access required");
    };

    switch (allBalances.get(principal)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
  };

  public query ({ caller }) func getAllDAOProposals() : async [DAOProposal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view DAO proposals");
    };

    daoProposals.values().toArray();
  };
};
