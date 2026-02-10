import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    nextDAOProposalId : Nat;
    nextWorkLogId : Nat;
    lastCitizenId : Nat;
    totalSuzi : Nat;
    principalToCitizenId : Map.Map<Principal, Nat>;
    workLogVerifications : Map.Map<Nat, [Principal]>;
    workLogs : Map.Map<Nat, WorkLogRaw>;
    daoProposals : Map.Map<Nat, DAOProposal>;
    daoVotes : Map.Map<Nat, [Nat]>;
    allBalances : Map.Map<Principal, Nat>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    owner : ?Principal;
  };

  type WorkLogRaw = {
    id : Nat;
    worker : Principal;
    category : { #physical; #knowledge; #creative; #wellness };
    description : Text;
    time : {
      startTime : Time.Time;
      endTime : Time.Time;
    };
    validations : Nat;
    status : { #pending; #completed };
  };

  type DAOProposal = {
    id : Nat;
    title : Text;
    description : Text;
    proposer : Principal;
    budget : Nat;
    yesVotes : Nat;
    noVotes : Nat;
    startTime : Time.Time;
  };

  type NewActor = {
    nextDAOProposalId : Nat;
    nextWorkLogId : Nat;
    lastCitizenId : Nat;
    totalSuzi : Nat;
    initialMintCompleted : Bool;
    principalToCitizenId : Map.Map<Principal, Nat>;
    workLogVerifications : Map.Map<Nat, [Principal]>;
    workLogs : Map.Map<Nat, WorkLogRaw>;
    daoProposals : Map.Map<Nat, DAOProposal>;
    daoVotes : Map.Map<Nat, [Nat]>;
    allBalances : Map.Map<Principal, Nat>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    {
      nextDAOProposalId = old.nextDAOProposalId;
      nextWorkLogId = old.nextWorkLogId;
      lastCitizenId = old.lastCitizenId;
      totalSuzi = old.totalSuzi;
      initialMintCompleted = false;
      principalToCitizenId = old.principalToCitizenId;
      workLogVerifications = old.workLogVerifications;
      workLogs = old.workLogs;
      daoProposals = old.daoProposals;
      daoVotes = old.daoVotes;
      allBalances = old.allBalances;
      userProfiles = old.userProfiles;
    };
  };
};
