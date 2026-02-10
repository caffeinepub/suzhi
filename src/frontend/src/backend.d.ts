import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkLogTimeSpan {
    startTime: Time;
    endTime: Time;
}
export type Time = bigint;
export interface WorkLog {
    id: bigint;
    status: ValidationStatus;
    time: WorkLogTimeSpan;
    description: string;
    category: WorkLogCategory;
    worker: Principal;
    validations: bigint;
}
export interface DAOProposal {
    id: bigint;
    startTime: Time;
    noVotes: bigint;
    title: string;
    yesVotes: bigint;
    description: string;
    proposer: Principal;
    budget: bigint;
}
export interface NewWorkLog {
    time: WorkLogTimeSpan;
    description: string;
    category: WorkLogCategory;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum ValidationStatus {
    pending = "pending",
    completed = "completed"
}
export enum VotingStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum WorkLogCategory {
    creative = "creative",
    wellness = "wellness",
    physical = "physical",
    knowledge = "knowledge"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkAirdrop(recipients: Array<Principal>, amount: bigint): Promise<void>;
    createWorkLog(input: NewWorkLog): Promise<bigint>;
    getAllDAOProposals(): Promise<Array<DAOProposal>>;
    getAllWorkLogs(): Promise<Array<WorkLog>>;
    getBalance(principal: Principal): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCitizenIdByPrincipal(principal: Principal): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVotingStatus(arg0: bigint): Promise<VotingStatus>;
    getWorkLogsByCategory(category: WorkLogCategory): Promise<Array<WorkLog>>;
    isCallerAdmin(): Promise<boolean>;
    onboardCitizen(citizenPrincipal: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitProposal(title: string, description: string, budget: bigint, startTime: Time): Promise<bigint>;
    transfer(to: Principal, amount: bigint): Promise<void>;
    validateWorkLog(workLogId: bigint): Promise<void>;
}
