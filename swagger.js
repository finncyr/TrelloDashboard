const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'TrelloDash API',
    description: 'Trello-API-Extension for the TrelloDashboard',
    version: '1.3.0',
  },
  host: 'localhost:3001',
  consumes: [],             // by default: ['application/json']
  produces: [],             // by default: ['application/json']
  tags: [                   // by default: empty Array
    {
      name: '',             // Tag name
      description: ''       // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {},  // by default: empty object
  definitions: {
    definitions: {
      Card: {
        id: '648efa9d3ca556526f67abcd',
        badges: {
          attachmentsByType: {
            trello: {
              board: 0,
              card: 0
            }
          },
          location: false,
          votes: 0,
          viewingMemberVoted: false,
          subscribed: false,
          fogbugz: '',
          checkItems: 0,
          checkItemsChecked: 0,
          checkItemsEarliestDue: null,
          comments: 0,
          attachments: 0,
          description: false,
          due: '2024-01-01T15:00:00.000Z',
          dueComplete: false,
          start: null
        },
        checkItemStates: [],
        closed: false,
        dueComplete: false,
        dateLastActivity: '2024-01-01T09:05:39.972Z',
        desc: '',
        descData: {
          emoji: {}
        },
        due: '2024-01-01T15:00:00.000Z',
        dueReminder: -1,
        email: null,
        idBoard: '5f07168df739986764e3405c',
        idChecklists: [],
        idList: '5f07168d9e057453845cfe88',
        idMembers: [
          '658c548ebef9b545a8b93abc',
          '65926b1937473c188d0c9def'
        ],
        idMembersVoted: [],
        idShort: 5,
        idAttachmentCover: null,
        labels: [
          {
            id: '5f07168df1bb5752f6b149df',
            idBoard: '5f07168df739986764e3405c',
            name: '30 min',
            color: 'yellow',
            uses: 6
          }
        ],
        idLabels: [
          '5f07168df1bb5752f6b149df'
        ],
        manualCoverAttachment: false,
        name: 'Testcard',
        pos: 262143,
        shortLink: '3E0lvPPe',
        shortUrl: 'https://trello.com/c/3E0lvPPe',
        start: null,
        subscribed: false,
        url: 'https://trello.com/c/3E0lvPPe/5-lkw-ausladen',
        cover: {
          idAttachment: null,
          color: null,
          idUploadedBackground: null,
          size: 'normal',
          brightness: 'dark',
          idPlugin: null
        },
        isTemplate: false,
        cardRole: null
      },
    List: {
        id: '5f07168d9e057453845abcdef',
        name: 'Testlist',
        closed: false,
        color: null,
        idBoard: '5f07168df739986764e3405c',
        pos: 0.5,
        subscribed: false,
        softLimit: null,
        creationMethod: 'assisted',
        idOrganization: '5f0716d07faa1c37b3bf873c',
        limits: {
          cards: {
            openPerList: {
              status: 'ok',
              disableAt: 5000,
              warnAt: 4000
            },
            totalPerList: {
              status: 'ok',
              disableAt: 1000000,
              warnAt: 800000
            }
          }
        },
        nodeId: 'ari:cloud:trello::list/workspace/5f0716d07faa1c37b3bf873c/5f07168d9e057453845cfe88'
    },
    CompactMember: {
      id: '658c402f25e12fdc0cc93abc',
      fullName: 'Max Mustermann',
      username: 'mmustermann',
      availabletime: 180,
      usedtime: 125
    },
    Member: {
        id: '658c402f25e12fdc0cc93abc',
        aaId: '712020:afe6f804-1de8-43ba-a4c5-6564f560a743',
        activityBlocked: false,
        avatarHash: 'ffb1e218065afd301772fccb0520abcd',
        avatarUrl: 'https://trello-members.s3.amazonaws.com/658c402f25e12fdc0cc935b9/ffb1e218065afd301772fccb0520abcd',
        bio: '',
        bioData: null,
        confirmed: true,
        fullName: 'Max Mustermann',
        idEnterprise: null,
        idEnterprisesDeactivated: null,
        idMemberReferrer: null,
        idPremOrgsAdmin: [],
        initials: 'MM',
        memberType: 'normal',
        nonPublic: {},
        nonPublicAvailable: true,
        products: [],
        url: 'https://trello.com/mmustermann',
        username: 'mmustermann',
        status: 'disconnected',
        aaBlockSyncUntil: null,
        aaEmail: null,
        aaEnrolledDate: null,
        avatarSource: null,
        credentialsRemovedCount: null,
        domainClaimed: null,
        email: null,
        gravatarHash: null,
        idBoards: [
          '5f07168df739986764e3abcd'
        ],
        idOrganizations: [],
        idEnterprisesAdmin: [],
        limits: {
          boards: {
            totalPerMember: {
              status: 'ok',
              disableAt: 4500,
              warnAt: 3600
            }
          },
          orgs: {
            totalPerMember: {
              status: 'ok',
              disableAt: 850,
              warnAt: 680
            }
          }
        },
        loginTypes: null,
        marketingOptIn: null,
        messagesDismissed: null,
        nodeId: 'ari:cloud:trello::user/658c402f25e12fdc0cc93abc',
        oneTimeMessagesDismissed: null,
        sessionType: null,
        prefs: null,
        trophies: [],
        uploadedAvatarHash: null,
        uploadedAvatarUrl: null,
        premiumFeatures: [
          'additionalBoardBackgrounds',
          'additionalStickers',
          'customBoardBackgrounds',
          'customEmoji',
          'customStickers',
          'plugins'
        ],
        isAaMastered: true,
        ixUpdate: '44'
      },
      ListMembers: [
        '658c402f25e12fdc0cc93abc'
      ]
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./server/index.js']; 

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);