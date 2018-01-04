// List of graphQL queries to send to anilist

import gql from "graphql-tag";

// TODO - Perhaps more and specific queries?
export const entryQuery = `
  query($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      coverImage {
        large
        medium
      }
      bannerImage
      duration
      synonyms
      format
      type
      status
      hashtag
      episodes
      chapters
      volumes
      description
      averageScore
      meanScore
      genres
      season
      isAdult
      popularity
      siteUrl
      idMal
      relations {
        edges {
          id
          relationType
          node {
            id
            title {
              english
              romaji
              native
            }
            coverImage {
              large
              medium
            }
            type
            format
            description
          }
        }
      }
      trailer {
        id
        site
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      source
      tags {
        id
        name
        description
        category
        rank
        isGeneralSpoiler
        isMediaSpoiler
        isAdult
      }
      externalLinks {
        id
        url
        site
      }
      rankings {
        id
        rank
        type
        format
        year
        season
        allTime
        context
      }
      airingSchedule {
        nodes {
          id
          airingAt
          timeUntilAiring
          episode
        }
      }
      studios {
        edges {
          node {
            id
            name
          }
          isMain
        }
      }
      staff {
        edges {
          node {
            id
            name {
              first
              last
              native
            }
            language
            image {
              large
              medium
            }
          }
          id
          role
        }
      }
    }
  }
`;

export const entryQueryM = `
  query($id: Int) {
    Media(id: $id, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      coverImage {
        large
        medium
      }
      bannerImage
      duration
      synonyms
      format
      type
      status
      hashtag
      episodes
      chapters
      volumes
      description
      averageScore
      meanScore
      genres
      season
      isAdult
      popularity
      siteUrl
      idMal
      relations {
        edges {
          id
          relationType
          node {
            id
            title {
              english
              romaji
              native
            }
            coverImage {
              large
              medium
            }
            type
            format
            description
          }
        }
      }
      trailer {
        id
        site
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      source
      tags {
        id
        name
        description
        category
        rank
        isGeneralSpoiler
        isMediaSpoiler
        isAdult
      }
      externalLinks {
        id
        url
        site
      }
      rankings {
        id
        rank
        type
        format
        year
        season
        allTime
        context
      }
      airingSchedule {
        nodes {
          id
          airingAt
          timeUntilAiring
          episode
        }
      }
      studios {
        edges {
          node {
            id
            name
          }
          isMain
        }
      }
      staff {
        edges {
          node {
            id
            name {
              first
              last
              native
            }
            language
            image {
              large
              medium
            }
          }
          id
          role
        }
      }
    }
  }
`;

export const bigFuckingQuery = `

query ($id: Int, $page: Int, $season: MediaSeason, $seasonYear: Int, $search: String, $status: MediaStatus, $isAdult: Boolean, $sort: [MediaSort]) {

  Page (page: $page) {

    pageInfo {

      total

      currentPage

      lastPage

      hasNextPage

      perPage

    }

    media (id: $id, search: $search, season: $season, seasonYear: $seasonYear, sort: $sort, status: $status, isAdult: $isAdult, type: ANIME) {

      id

      title {

        romaji

        english

        native

      }

      startDate {

          year,

          month,

          day

      }

      endDate {

          year,

          month,

          day

      }

      coverImage {

          large

          medium

      }

      bannerImage

      format

      type

      status

      episodes

      chapters

      volumes

      description

      averageScore

      meanScore

      genres

      season

      isAdult

      popularity

      nextAiringEpisode {

          airingAt

          timeUntilAiring

          episode

      }

    }

  }

}

`;

export const tagQuery = `
  query(
    $id: Int
    $page: Int
    $season: MediaSeason
    $seasonYear: Int
    $search: String
    $status: MediaStatus
    $isAdult: Boolean
    $sort: [MediaSort]
  ) {
    Page(page: $page) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(
        id: $id
        search: $search
        season: $season
        seasonYear: $seasonYear
        sort: $sort
        status: $status
        isAdult: $isAdult
        type: ANIME
      ) {
        id
        title {
          romaji
          english
          native
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        coverImage {
          large
          medium
        }
        bannerImage
        format
        type
        status
        episodes
        tags {
          id
          name
          description
          category
          rank
          isGeneralSpoiler
          isMediaSpoiler
          isAdult
        }
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`;

export const feedQuery = `
  query($id: Int, $page: Int, $userId: Int, $sort: [ActivitySort]) {
    Page(page: $page) {
      pageInfo {
        total
        currentPage
        lastPage
        hastNextPage
        perPage
      }
      activity(id: $id, userId: $userId) {
        id
        userId
        messengerId
        hasReplies
        type
      }
    }
  }
`;

export const smolQuery = `
  query($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      coverImage {
        large
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      episodes
    }
  }
`;
