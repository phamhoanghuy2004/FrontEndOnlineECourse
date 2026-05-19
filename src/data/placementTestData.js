// Mock data for Adaptive Placement Test
// 4 Skills: Grammar, Vocabulary, Reading, Listening
// Each skill has questions at levels 1-5 (2 questions per level to support adaptive routing)

export const placementTestData = {
  Grammar: {
    1: [
      {
        id: "g_1_1",
        skill: "Grammar",
        level: 1,
        question: "She _______ to school every day.",
        options: ["go", "goes", "going", "went"],
        correct: 1, // goes
        explanation: "Simple present tense third-person singular requires -es."
      },
      {
        id: "g_1_2",
        skill: "Grammar",
        level: 1,
        question: "They _______ playing soccer in the park right now.",
        options: ["is", "are", "am", "be"],
        correct: 1, // are
        explanation: "Present continuous tense helper verb for 'they' is 'are'."
      }
    ],
    2: [
      {
        id: "g_2_1",
        skill: "Grammar",
        level: 2,
        question: "If it rains tomorrow, we _______ the picnic.",
        options: ["cancel", "would cancel", "will cancel", "canceled"],
        correct: 2, // will cancel
        explanation: "First conditional: If + present simple, will + verb."
      },
      {
        id: "g_2_2",
        skill: "Grammar",
        level: 2,
        question: "I have been living in this city _______ three years.",
        options: ["since", "for", "during", "ago"],
        correct: 1, // for
        explanation: "Use 'for' to describe a duration of time."
      }
    ],
    3: [
      {
        id: "g_3_1",
        skill: "Grammar",
        level: 3,
        question: "The manager _______ the meeting before we arrived.",
        options: ["starts", "had started", "starting", "start"],
        correct: 1, // had started
        explanation: "Past perfect tense is used for an action completed before another past action."
      },
      {
        id: "g_3_2",
        skill: "Grammar",
        level: 3,
        question: "The client requested that the contract _______ revised immediately.",
        options: ["be", "is", "was", "will be"],
        correct: 0, // be
        explanation: "Subjunctive mood: request/demand that + subject + bare infinitive (be)."
      }
    ],
    4: [
      {
        id: "g_4_1",
        skill: "Grammar",
        level: 4,
        question: "Hardly _______ entered the office when the phone started ringing.",
        options: ["he had", "had he", "he has", "did he"],
        correct: 1, // had he
        explanation: "Inversion after negative adverbial 'hardly': Hardly + auxiliary verb + subject."
      },
      {
        id: "g_4_2",
        skill: "Grammar",
        level: 4,
        question: "The CEO was heard _______ that the merger would go through next month.",
        options: ["say", "said", "to say", "saying"],
        correct: 2, // to say
        explanation: "Passive voice of verbs of perception: be heard/seen + to-infinitive."
      }
    ],
    5: [
      {
        id: "g_5_1",
        skill: "Grammar",
        level: 5,
        question: "Were it not for your timely assistance, we _______ in meeting the deadline.",
        options: ["would fail", "will fail", "would have failed", "had failed"],
        correct: 2, // would have failed
        explanation: "Inverted third conditional: Were it not for (If it hadn't been for) + past participle equivalent, would have + past participle."
      },
      {
        id: "g_5_2",
        skill: "Grammar",
        level: 5,
        question: "No sooner _______ the new policy than staff productivity increased dramatically.",
        options: ["had the management implemented", "the management had implemented", "did the management implemented", "has the management implemented"],
        correct: 0, // had the management implemented
        explanation: "Inversion with 'no sooner... than': No sooner + past perfect auxiliary + subject + past participle."
      }
    ]
  },
  Vocabulary: {
    1: [
      {
        id: "v_1_1",
        skill: "Vocabulary",
        level: 1,
        question: "Please write your name at the _______ of the form.",
        options: ["top", "head", "roof", "peak"],
        correct: 0, // top
        explanation: "Collocation: 'top of the form'."
      },
      {
        id: "v_1_2",
        skill: "Vocabulary",
        level: 1,
        question: "I need to _______ a flight to Tokyo next week.",
        options: ["make", "buy", "book", "take"],
        correct: 2, // book
        explanation: "To reserve a ticket/flight is to 'book' a flight."
      }
    ],
    2: [
      {
        id: "v_2_1",
        skill: "Vocabulary",
        level: 2,
        question: "The company offers a generous annual _______ to all staff.",
        options: ["salary", "bonus", "fare", "fee"],
        correct: 1, // bonus
        explanation: "An extra payment in addition to salary is a 'bonus'."
      },
      {
        id: "v_2_2",
        skill: "Vocabulary",
        level: 2,
        question: "Please confirm your _______ of the package by signing here.",
        options: ["receipt", "reception", "receiver", "receiving"],
        correct: 0, // receipt
        explanation: "Noun 'receipt' means the act of receiving something."
      }
    ],
    3: [
      {
        id: "v_3_1",
        skill: "Vocabulary",
        level: 3,
        question: "We need to _______ our marketing strategy to target a younger audience.",
        options: ["diversify", "deviate", "distort", "dilute"],
        correct: 0, // diversify
        explanation: "To diversify means to enlarge the range of products or field of operation."
      },
      {
        id: "v_3_2",
        skill: "Vocabulary",
        level: 3,
        question: "The new regulations have a direct _______ on our overseas operations.",
        options: ["bearing", "attitude", "standing", "aspect"],
        correct: 0, // bearing
        explanation: "Idiom: 'have a bearing on' means to have an influence on or relation to."
      }
    ],
    4: [
      {
        id: "v_4_1",
        skill: "Vocabulary",
        level: 4,
        question: "The board of directors gave their _______ approval to the proposed budget.",
        options: ["tacit", "vague", "skeptical", "tentative"],
        correct: 0, // tacit
        explanation: "'Tacit approval' refers to implied or silent consent without explicit statement."
      },
      {
        id: "v_4_2",
        skill: "Vocabulary",
        level: 4,
        question: "His argument was so _______ that even his opponents were convinced.",
        options: ["cogent", "redundant", "feeble", "equivocal"],
        correct: 0, // cogent
        explanation: "'Cogent' means clear, logical, and convincing."
      }
    ],
    5: [
      {
        id: "v_5_1",
        skill: "Vocabulary",
        level: 5,
        question: "The government decided to _______ the outdated trade restrictions to stimulate the economy.",
        options: ["rescind", "endorse", "perpetuate", "consolidate"],
        correct: 0, // rescind
        explanation: "'Rescind' means to revoke, cancel, or repeal a law or agreement."
      },
      {
        id: "v_5_2",
        skill: "Vocabulary",
        level: 5,
        question: "Despite the volatility of the market, the firm managed to maintain a _______ financial position.",
        options: ["solvent", "precarious", "bankrupt", "liquid"],
        correct: 0, // solvent
        explanation: "'Solvent' in a financial context means having assets in excess of liabilities; able to pay one's debts."
      }
    ]
  },
  Reading: {
    1: [
      {
        id: "r_1_1",
        skill: "Reading",
        level: 1,
        passage: "Welcome to TechCorp! Office hours are from 9 AM to 5 PM, Monday through Friday. Lunch break is from 12 PM to 1 PM.",
        question: "What time does the lunch break start?",
        options: ["9 AM", "12 PM", "1 PM", "5 PM"],
        correct: 1,
        explanation: "According to the passage, the lunch break is from 12 PM to 1 PM."
      },
      {
        id: "r_1_2",
        skill: "Reading",
        level: 1,
        passage: "Please turn off all lights and computers before leaving the building to conserve energy.",
        question: "Why should employees turn off lights and computers?",
        options: ["To save energy", "To prevent fires", "To clean the office", "To lock the doors"],
        correct: 0,
        explanation: "The passage explicitly states 'to conserve energy'."
      }
    ],
    2: [
      {
        id: "r_2_1",
        skill: "Reading",
        level: 2,
        passage: "Dear Customers, due to maintenance, our online banking system will be unavailable this Saturday from 10 PM to Sunday 4 AM. We apologize for any inconvenience.",
        question: "How long will the banking system be offline?",
        options: ["4 hours", "6 hours", "8 hours", "10 hours"],
        correct: 1, // 10 PM to 4 AM is 6 hours
        explanation: "From 10 PM Saturday to 4 AM Sunday is exactly 6 hours."
      },
      {
        id: "r_2_2",
        skill: "Reading",
        level: 2,
        passage: "The annual marketing conference will be held at the Grand Plaza Hotel in Chicago. Register before June 1st to get a 20% early-bird discount.",
        question: "How can attendees receive a discount?",
        options: ["By booking a room", "By registering before June 1st", "By joining the committee", "By living in Chicago"],
        correct: 1,
        explanation: "Register before June 1st to get a 20% early-bird discount."
      }
    ],
    3: [
      {
        id: "r_3_1",
        skill: "Reading",
        level: 3,
        passage: "Notice: The human resources department is transitioning to a digital onboarding system. Starting next month, all payroll setup and safety training modules must be completed via the employee portal. Physical forms will no longer be accepted.",
        question: "What is the primary change described in the notice?",
        options: [
          "Safety rules are being updated.",
          "Onboarding is moving entirely online.",
          "New employees will be hired next month.",
          "Physical forms will no longer be accepted."
        ],
        correct: 1,
        explanation: "The passage highlights transitioning to a digital onboarding system and that physical forms will no longer be accepted."
      },
      {
        id: "r_3_2",
        skill: "Reading",
        level: 3,
        passage: "Memo to Project Team: To address current bottlenecks in software delivery, we will adopt bi-weekly sprint reviews starting immediately. These sessions will replace our weekly status emails, allowing for real-time feedback and adjustment of task priorities.",
        question: "What will replace the weekly status emails?",
        options: [
          "Bi-weekly sprint reviews",
          "Daily stand-up meetings",
          "Monthly project summaries",
          "Individual feedback sessions"
        ],
        correct: 0,
        explanation: "The text states 'These sessions (bi-weekly sprint reviews) will replace our weekly status emails'."
      }
    ],
    4: [
      {
        id: "r_4_1",
        skill: "Reading",
        level: 4,
        passage: "Executive Summary: The acquisition of Apex Logistics is expected to synergize with our existing supply chain network. By consolidating warehousing assets in the Midwest, we anticipate a 15% overhead reduction within eighteen months. However, integration risks remain due to incompatible warehouse management software platforms currently used by both firms.",
        question: "What potential obstacle does the summary identify?",
        options: [
          "Higher warehouse rental rates in the Midwest",
          "Software incompatibility between the companies",
          "Underperforming supply chain employees",
          "An increase in overall overhead expenses"
        ],
        correct: 1,
        explanation: "The text warns of integration risks due to 'incompatible warehouse management software platforms'."
      },
      {
        id: "r_4_2",
        skill: "Reading",
        level: 4,
        passage: "Dear Shareholders, despite macroeconomic headwinds and rising raw material costs, our expansion into the European market has yielded positive returns. Operating margins improved by 2.4 basis points, largely driven by our newly automated distribution center in Rotterdam, which successfully offset labor shortages in local markets.",
        question: "What factor helped mitigate the impact of labor shortages?",
        options: [
          "An increase in product prices",
          "Lower European interest rates",
          "The automation of a distribution hub",
          "Sourcing cheaper raw materials"
        ],
        correct: 2,
        explanation: "The automated distribution center in Rotterdam offset local labor shortages."
      }
    ],
    5: [
      {
        id: "r_5_1",
        skill: "Reading",
        level: 5,
        passage: "Academic Journal Excerpt: The transition to green hydrogen energy is contingent upon scaling polymer electrolyte membrane (PEM) electrolyzers. While PEM technology offers superb dynamic response compatible with intermittent renewable inputs, its reliance on scarce iridium catalysts poses a severe macroeconomic bottleneck. Current research focuses on developing non-noble transition metal alloy alternatives, but their catalytic efficiency and durability under acidic conditions remain substandard. Consequently, the commercial viability of PEM-driven green hydrogen projects remains speculative at scale.",
        question: "Which of the following describes the central problem with PEM electrolyzer scaling?",
        options: [
          "Their inability to handle fluctuating energy inputs from renewable sources",
          "The lack of research into transition metal alloys under acidic conditions",
          "Supply chain vulnerabilities concerning rare iridium catalysts",
          "The excessive cost of building large-scale wind and solar grids"
        ],
        correct: 2,
        explanation: "The passage notes that 'its reliance on scarce iridium catalysts poses a severe macroeconomic bottleneck'."
      },
      {
        id: "r_5_2",
        skill: "Reading",
        level: 5,
        passage: "Industry Analysis: The semiconductor industry is experiencing a paradigm shift towards Chiplet architectures. By breaking down a monolithic die into smaller, specialized chiplets, manufacturers can bypass physical lithography limits and improve wafer yield rates. However, this modularity introduces substantial packaging complexity. High-density interconnects and thermal dissipation become critical failure vectors, demanding advanced silicon interposers that remain prohibitively expensive for consumer-grade electronics.",
        question: "What is a major trade-off associated with transitioning to Chiplet architectures?",
        options: [
          "Decreased wafer yield rates at lithographic limits",
          "Reduced compatibility with specialized consumer electronics",
          "Increased complexity in packaging and heat dissipation",
          "A reliance on monolithic silicon crystal structures"
        ],
        correct: 2,
        explanation: "Modularity introduces packaging complexity, and high-density interconnects and thermal dissipation become critical failure vectors."
      }
    ]
  },
  Listening: {
    1: [
      {
        id: "l_1_1",
        skill: "Listening",
        level: 1,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        question: "Who is the speaker talking to?",
        options: ["A receptionist", "A doctor", "A mechanic", "A teacher"],
        correct: 0,
        transcript: "Hi, I'd like to check in for my 2 PM appointment under the name of Sarah Mills. Here is my ID.",
        explanation: "Checking in for an appointment and presenting an ID is typical when talking to a receptionist."
      },
      {
        id: "l_1_2",
        skill: "Listening",
        level: 1,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        question: "What is the weather forecast for tomorrow?",
        options: ["Sunny", "Rainy", "Snowy", "Cloudy"],
        correct: 1,
        transcript: "Make sure to bring an umbrella with you tomorrow morning, as heavy rain is expected to last all afternoon.",
        explanation: "The speaker mentions heavy rain and bringing an umbrella."
      }
    ],
    2: [
      {
        id: "l_2_1",
        skill: "Listening",
        level: 2,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        question: "Why did the train stop?",
        options: ["Engine failure", "Signal malfunction", "Passenger emergency", "Scheduled maintenance"],
        correct: 1,
        transcript: "Attention passengers, the train has come to a halt due to a signal malfunction ahead. We expect to resume in ten minutes.",
        explanation: "The conductor announces the stop is due to a signal malfunction."
      },
      {
        id: "l_2_2",
        skill: "Listening",
        level: 2,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        question: "What time will the office close today?",
        options: ["3:00 PM", "4:30 PM", "5:00 PM", "6:00 PM"],
        correct: 1,
        transcript: "Please note that due to the approaching storm, the office will shut early today at 4:30 PM instead of our usual 6 PM.",
        explanation: "The speaker states the office closes early today at 4:30 PM."
      }
    ],
    3: [
      {
        id: "l_3_1",
        skill: "Listening",
        level: 3,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        question: "What does the man request from the vendor?",
        options: [
          "An expedited shipping quote",
          "An itemized invoice",
          "A product catalogue",
          "A replacement parts list"
        ],
        correct: 1,
        transcript: "Hello, this is Robert from purchasing. We received the shipment of chairs, but we need an itemized invoice for accounting before we can release payment. Can you email it to me today?",
        explanation: "He says, 'we need an itemized invoice for accounting before we can release payment.'"
      },
      {
        id: "l_3_2",
        skill: "Listening",
        level: 3,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        question: "What is the focus of next week's workshop?",
        options: [
          "Conflict resolution",
          "Time management tools",
          "Customer relationship software",
          "Budgeting strategies"
        ],
        correct: 2,
        transcript: "Hi team, please ensure you complete the onboarding tutorial for our new CRM database. Next week's workshop will focus on using the software's analytics tool to track customer interactions.",
        explanation: "The CRM (Customer Relationship Management) database software training is next week's focus."
      }
    ],
    4: [
      {
        id: "l_4_1",
        skill: "Listening",
        level: 4,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        question: "What is the speaker's main concern about the supplier's proposal?",
        options: [
          "The lack of environmental certifications",
          "The extended lead times for custom orders",
          "The volatility of shipping costs",
          "The rigid payment schedule options"
        ],
        correct: 1,
        transcript: "While their unit pricing is highly competitive, their proposed 60-day turnaround on custom components is a dealbreaker for us. We need a supplier who can deliver custom orders within a 30-day window to avoid assembly delays.",
        explanation: "The speaker is concerned about the turnaround/lead times ('60-day turnaround on custom components is a dealbreaker')."
      },
      {
        id: "l_4_2",
        skill: "Listening",
        level: 4,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        question: "Which department is currently experiencing the greatest budget cuts?",
        options: [
          "Public Relations",
          "Research and Development",
          "Quality Assurance",
          "Human Resources"
        ],
        correct: 0,
        transcript: "To offset our current deficit, the board has mandated trim options. While R&D remains relatively untouched to preserve future growth, the Public Relations wing will suffer a 25% drop in operational allocation, followed by QA at 10%.",
        explanation: "Public Relations is cut by 25%, while R&D is untouched and QA is cut by 10%."
      }
    ],
    5: [
      {
        id: "l_5_1",
        skill: "Listening",
        level: 5,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        question: "Which strategy does the analyst recommend to mitigate currency risk?",
        options: [
          "Utilizing forward contracts to lock in exchange rates",
          "Shifting manufacturing assets to domestic facilities",
          "Invoicing clients exclusively in local currency",
          "Increasing product diversification in emerging markets"
        ],
        correct: 0,
        transcript: "Given the projected fluctuations in the Euro-Dollar pair, relying on spot market transactions is highly risky. We recommend hedging our exposure by securing forward contracts for the third quarter, which will lock in our margins regardless of forex swings.",
        explanation: "The analyst recommends hedging exposure by 'securing forward contracts for the third quarter'."
      },
      {
        id: "l_5_2",
        skill: "Listening",
        level: 5,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        question: "What is the primary reason for the company's rebranding initiative?",
        options: [
          "To appeal to a younger, tech-savvy demographic",
          "To distance themselves from recent public controversies",
          "To align their image with a shift towards sustainable services",
          "To prepare for a potential corporate acquisition"
        ],
        correct: 2,
        transcript: "Our traditional legacy branding conveys heavy industrial manufacturing, which doesn't reflect our pivot towards carbon-neutral advisory services. The new visual identity must position us as a sustainability partner for the modern economy.",
        explanation: "Rebranding aligns with their pivot towards carbon-neutral/sustainable services."
      }
    ]
  }
};
