"use client";

import {
  gql,
  ApolloClient,
  ApolloLink,
  HttpLink,
  SuspenseCache,
  makeVar
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache, 
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { FormData, Profiles, ProfilesData } from "@/models/cv";

function makeClient() {
  const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_SERVER + "/query",
  });

  return new ApolloClient({
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            profile: {
              read () {
                return profilesVar();
              }
            }
          }
        }
      }
    }),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

const emptyFormData: FormData = {
  userBio: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
  },
  jobPosting: {
      title: '',
      company: '',
      sector: '',
      requirements: '',
      addOn: ''
  },
  experiences: [{
      id: 1,
      title: '',
      company: '',
      sector: '',
      isCurrent: false,
      startDate: '',
      endDate: '',
      achievements: ''
  }],
  education: [{
      id: 1,
      subject: '',
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
  }],
  skillset: {
      skillsets: '',
  }
}

const profileInitialValue: ProfilesData = []

export const profilesVar = makeVar<ProfilesData>(
  profileInitialValue
)

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
    >
      {children}
    </ApolloNextAppProvider>
  );
}