/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AchievementInput = {
  experience: ExperienceInput;
  jobPosting: JobPostingInput;
  userBio: UserBioInput;
};

export type CvContent = {
  __typename?: 'CVContent';
  education: Array<Education>;
  experiences: Array<Experience>;
  skillsets?: Maybe<Skillset>;
  summary: Summary;
  userBio: UserBio;
};

export type CvContentInput = {
  education: Array<EducationInput>;
  experiences: Array<ExperienceInput>;
  skillsets?: InputMaybe<SkillsetInput>;
  summary: SummaryInput;
  userBio: UserBioInput;
};

export type Cv = {
  __typename?: 'Cv';
  cvContent: CvContent;
  cvType?: Maybe<CvType>;
  id?: Maybe<Scalars['ID']['output']>;
  jobPosting: JobPosting;
};

export type CvFile = {
  __typename?: 'CvFile';
  createdAt: Scalars['String']['output'];
  filename: Scalars['String']['output'];
};

export type CvInput = {
  cvContent: CvContentInput;
  cvType?: InputMaybe<CvType>;
  id?: InputMaybe<Scalars['ID']['input']>;
  jobPosting: JobPostingInput;
};

export enum CvType {
  Base = 'BASE',
  Prime = 'PRIME'
}

export type Education = {
  __typename?: 'Education';
  degree: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  institution: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
  subject: Scalars['String']['output'];
};

export type EducationInput = {
  degree: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  institution: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type EnhancedAchievement = {
  __typename?: 'EnhancedAchievement';
  achievements: Scalars['String']['output'];
  match: Match;
};

export type Experience = {
  __typename?: 'Experience';
  achievements: Scalars['String']['output'];
  company: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isCurrent: Scalars['Boolean']['output'];
  sector: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ExperienceInput = {
  achievements: Scalars['String']['input'];
  company: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isCurrent: Scalars['Boolean']['input'];
  sector: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type JobPosting = {
  __typename?: 'JobPosting';
  addOn?: Maybe<Scalars['String']['output']>;
  company: Scalars['String']['output'];
  requirements: Scalars['String']['output'];
  sector: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type JobPostingInput = {
  addOn?: InputMaybe<Scalars['String']['input']>;
  company: Scalars['String']['input'];
  requirements: Scalars['String']['input'];
  sector: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Match = {
  __typename?: 'Match';
  matchFactor?: Maybe<Scalars['Int']['output']>;
  reason: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  enhanceAchievement: EnhancedAchievement;
  generateCV: CvFile;
  generateSampleCv: SampleCv;
  generateSummary: Summary;
};


export type MutationEnhanceAchievementArgs = {
  input: AchievementInput;
};


export type MutationGenerateCvArgs = {
  input: CvInput;
};


export type MutationGenerateSampleCvArgs = {
  input: SampleCvInput;
};


export type MutationGenerateSummaryArgs = {
  input: CvInput;
};

export type Query = {
  __typename?: 'Query';
  filename: Array<CvFile>;
  summary: Summary;
};


export type QuerySummaryArgs = {
  id: Scalars['ID']['input'];
};

export type SampleCv = {
  __typename?: 'SampleCv';
  experiences: Array<Experience>;
};

export type SampleCvInput = {
  jobRequirements: Scalars['String']['input'];
  sector: Scalars['String']['input'];
  title: Scalars['String']['input'];
  yearsOfExperience: Scalars['Int']['input'];
};

export type Skillset = {
  __typename?: 'Skillset';
  skillsets: Scalars['String']['output'];
};

export type SkillsetInput = {
  skillsets: Scalars['String']['input'];
};

export type Summary = {
  __typename?: 'Summary';
  summary: Scalars['String']['output'];
};

export type SummaryInput = {
  summary: Scalars['String']['input'];
};

export type UserBio = {
  __typename?: 'UserBio';
  address: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type UserBioInput = {
  address: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type GenerateCvMutationVariables = Exact<{
  input: CvInput;
}>;


export type GenerateCvMutation = { __typename?: 'Mutation', generateCV: { __typename?: 'CvFile', filename: string } };

export type GenerateSummaryMutationVariables = Exact<{
  input: CvInput;
}>;


export type GenerateSummaryMutation = { __typename?: 'Mutation', generateSummary: { __typename?: 'Summary', summary: string } };

export type EnhanceAchievementMutationVariables = Exact<{
  input: AchievementInput;
}>;


export type EnhanceAchievementMutation = { __typename?: 'Mutation', enhanceAchievement: { __typename?: 'EnhancedAchievement', achievements: string, match: { __typename?: 'Match', matchFactor?: number | null, reason: string } } };


export const GenerateCvDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"generateCV"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CvInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateCV"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filename"}}]}}]}}]} as unknown as DocumentNode<GenerateCvMutation, GenerateCvMutationVariables>;
export const GenerateSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"generateSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CvInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateSummary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]}}]} as unknown as DocumentNode<GenerateSummaryMutation, GenerateSummaryMutationVariables>;
export const EnhanceAchievementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"enhanceAchievement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AchievementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enhanceAchievement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"match"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"matchFactor"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}},{"kind":"Field","name":{"kind":"Name","value":"achievements"}}]}}]}}]} as unknown as DocumentNode<EnhanceAchievementMutation, EnhanceAchievementMutationVariables>;