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
      uri: "https://cvhq-platform-production.fly.dev/query",
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

function makeSuspenseCache() {
  return new SuspenseCache();
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
  skillsets: {
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
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );
}