import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, Feather, RotateCcw } from 'lucide-react';
import type { ModularEngineProps } from './types';

export type English3DVariant =
  | 'flight'
  | 'life'
  | 'tempest'
  | 'ghost'
  | 'zigzag'
  | 'navigating'
  | 'attic'
  | 'tech'
  | 'lastlesson'
  | 'detective';

interface NarrativeEvent {
  id: string;
  order: number;
  pageRef: string;
  title: string;
  viewA: string;
  viewB: string;
}

interface StoryDataset {
  title: string;
  pageRange: string;
  perspectiveALabel: string;
  perspectiveBLabel: string;
  events: NarrativeEvent[];
  scrambledOrder: string[];
  successSeqMsg: string;
  vocabTitle: string;
  vocabPairs: { id: string; word: string; meaning: string }[];
  referenceTitle: string;
  referenceRows: [string, string, string, string][];
  referenceCols: [string, string, string, string];
}

export const STORY_DATASETS: Record<English3DVariant, StoryDataset> = {
  flight: {
    title: 'His First Flight',
    pageRange: 'pp. 2–5',
    perspectiveALabel: 'Young Seagull',
    perspectiveBLabel: 'Mother & Family',
    events: [
      {
        id: 'ledge-fear',
        order: 1,
        pageRef: 'p. 2',
        title: 'Retreating from the Brink',
        viewA: 'The sea stretches miles below; I feel certain my wings will never hold me up.',
        viewB: 'His younger siblings with shorter wings already took off — he has the strength, only fear holds him back.',
      },
      {
        id: 'family-distance',
        order: 2,
        pageRef: 'pp. 2–3',
        title: '24 Hours Alone & Pretending to Sleep',
        viewA: 'Everyone is feasting on herring across the cliff while I search an empty nest and pretend to doze.',
        viewB: 'Staying across the chasm shows him he cannot depend on others forever.',
      },
      {
        id: 'mother-fish',
        order: 3,
        pageRef: 'pp. 3–4',
        title: 'Mother Halts with Fish Just Out of Reach',
        viewA: 'Mother is bringing food! Why did she stop motionless just past the rock edge?',
        viewB: 'Holding the fish inches away gives him a compelling reason to leap.',
      },
      {
        id: 'dive-soar',
        order: 4,
        pageRef: 'p. 4',
        title: 'The Plunge & Discovering Wing Lift',
        viewA: 'Monstrous terror lasts a heartbeat — then wind rushes beneath my feathers and I am soaring!',
        viewB: 'Swooping beside him with joyful cries so he feels supported as he banks against the wind.',
      },
      {
        id: 'green-sea',
        order: 5,
        pageRef: 'pp. 4–5',
        title: 'Floating on the Green Sea',
        viewA: 'My legs sink in exhaustion, then my belly rests safely on the water — I made my first flight!',
        viewB: 'Circling in pride and offering scraps of dog-fish to celebrate his independence.',
      },
    ],
    scrambledOrder: ['mother-fish', 'ledge-fear', 'green-sea', 'family-distance', 'dive-soar'],
    successSeqMsg:
      '✓ Exact narrative arc! Fear → Isolation → Mother’s catalyst → Wing lift → Safe landing on the green sea.',
    vocabTitle: 'Match Unit 1 Prose Glossary Terms (p. 5)',
    vocabPairs: [
      { id: 'precipice', word: 'Precipice (n.)', meaning: 'A very steep cliff face or vertical drop (p. 5)' },
      { id: 'preening', word: 'Preening (v.)', meaning: 'Cleaning and arranging feathers with a beak (p. 5)' },
      { id: 'plaintively', word: 'Plaintively (adv.)', meaning: 'Calling in a sad, mournful, pleading tone (p. 5)' },
      { id: 'beckoning', word: 'Beckoning (v.)', meaning: 'Gesturing or calling to invite someone to approach (p. 5)' },
    ],
    referenceTitle: 'Parts of Speech Transformations (Textbook p. 6)',
    referenceCols: ['Noun', 'Verb', 'Adjective', 'Adverb'],
    referenceRows: [
      ['joy', 'enjoy', 'joyful', 'joyfully'],
      ['exhaustion', 'exhaust', 'exhausted', 'exhaustedly'],
      ['width', 'widen', 'wide', 'widely'],
      ['perfection', 'perfect', 'perfect', 'perfectly'],
    ],
  },
  life: {
    title: 'Life (Sonnet by Henry Van Dyke)',
    pageRange: 'pp. 17–18',
    perspectiveALabel: 'Optimistic Poet-Traveller',
    perspectiveBLabel: 'Poetic Craft & Imagery',
    events: [
      {
        id: 'forward-face',
        order: 1,
        pageRef: 'p. 17 (Lines 1–4)',
        title: 'Unreluctant Forward Outlook',
        viewA: 'I welcome every year with an open heart — never hurrying away or turning back to mourn the vanished past.',
        viewB: 'Octave opens with direct first-person resolve and calm acceptance of passing time.',
      },
      {
        id: 'dim-future',
        order: 2,
        pageRef: 'p. 17 (Lines 5–8)',
        title: 'Trusting the Unseen Future',
        viewA: 'I refuse to dread what the mist hides ahead; I pay my toll gladly to Youth and Age alike.',
        viewB: 'Personification of "Youth and Age" and metaphor of life’s toll bridge emphasize resilience.',
      },
      {
        id: 'uphill-downhill',
        order: 3,
        pageRef: 'p. 17 (Lines 9–10)',
        title: 'Embracing Smooth and Rough Roads',
        viewA: 'Whether the path climbs steep hills or glides down easy slopes, the journey itself stays joyful.',
        viewB: 'Antithesis ("up the hill or down" / "rough or smooth") mirrors life’s inevitable ups and downs.',
      },
      {
        id: 'new-friendship',
        order: 4,
        pageRef: 'p. 17 (Lines 11–12)',
        title: 'Still Seeking Friendship & Adventure',
        viewA: 'Even as years advance, I keep looking for fresh friendships, high adventures, and a worthy crown.',
        viewB: 'Sestet shifts from enduring hardships to actively pursuing growth and noble purpose.',
      },
      {
        id: 'best-last-turn',
        order: 5,
        pageRef: 'p. 17 (Lines 13–14)',
        title: 'Courage for the Road’s Final Turn',
        viewA: 'My heart keeps its courage to the end, trusting that the last bend in the road will be the finest.',
        viewB: 'Closing rhyming lines tie the entire 14-line Petrarchan/hybrid sonnet into enduring hope.',
      },
    ],
    scrambledOrder: ['uphill-downhill', 'forward-face', 'best-last-turn', 'dim-future', 'new-friendship'],
    successSeqMsg:
      '✓ Exact poetic progression! Forward resolve → Fearless trust → Smooth & rough terrain → Lifelong curiosity → Hopeful final turn.',
    vocabTitle: 'Match Unit 1 Poem Vocabulary & Poetic Terms (pp. 17–18)',
    vocabPairs: [
      { id: 'unreluctant', word: 'Unreluctant (adj.)', meaning: 'Willing and eager without hesitation (p. 17)' },
      { id: 'mourning', word: 'Mourning (v.)', meaning: 'Feeling deep sorrow over something lost in the past (p. 17)' },
      { id: 'quest', word: 'Quest (n.)', meaning: 'A purposeful search or adventurous journey (p. 17)' },
      { id: 'sonnet', word: 'Sonnet (n.)', meaning: 'A 14-line lyric poem structured into an octave and sestet (p. 18)' },
    ],
    referenceTitle: 'Poetic Devices Snapshot for "Life" (pp. 17–18)',
    referenceCols: ['Device', 'Concept in Poem', 'Effect on Reader', 'Section'],
    referenceRows: [
      ['Metaphor', 'Life compared to a winding road', 'Makes abstract years feel like an active journey', 'Octave & Sestet'],
      ['Antithesis', 'Up the hill / down; rough / smooth', 'Shows balanced courage across good & hard times', 'Sestet'],
      ['Personification', 'Youth and Age collecting toll', 'Presents stages of life as fair companions', 'Octave'],
      ['Rhyme Scheme', 'abba abba cdd cee (14 lines)', 'Creates musical unity across reflections', 'Full Sonnet'],
    ],
  },
  tempest: {
    title: 'The Tempest (Adapted from Shakespeare)',
    pageRange: 'pp. 21–24',
    perspectiveALabel: 'Prospero & Ariel',
    perspectiveBLabel: 'Miranda, Ferdinand & King Alonso',
    events: [
      {
        id: 'enchanted-storm',
        order: 1,
        pageRef: 'p. 21',
        title: 'Prospero & Ariel Raise the Tempest',
        viewA: 'Using gentle magic, I raise a dramatic storm to bring my brother Antonio and King Alonso onto the island without harming a single sailor.',
        viewB: 'Miranda watches the tossing ship with deep compassion and begs her father to calm the wild waters.',
      },
      {
        id: 'exile-story',
        order: 2,
        pageRef: 'pp. 21–22',
        title: 'Prospero Reveals the Past Exile',
        viewA: 'Twelve years ago, my brother Antonio usurped my Dukedom of Milan; loyal Gonzalo secretly stocked our boat with food and my treasured books.',
        viewB: 'Miranda learns for the first time that she is a Duke’s daughter and why they live in the island cave.',
      },
      {
        id: 'ferdinand-test',
        order: 3,
        pageRef: 'pp. 22–23',
        title: 'Ariel Guides Prince Ferdinand to Miranda',
        viewA: 'Ariel’s music leads Ferdinand safely ashore; I set him to carry heavy logs to test whether his love for Miranda is truly sincere.',
        viewB: 'Ferdinand gladly labours for Miranda’s sake, while Miranda offers to help — proving genuine mutual devotion.',
      },
      {
        id: 'repentance-trial',
        order: 4,
        pageRef: 'p. 23',
        title: 'Ariel Confronts King Alonso & Antonio',
        viewA: 'Through a vanishing banquet and Ariel’s solemn warning, I awaken sincere remorse in those who betrayed me.',
        viewB: 'Grieving for his supposedly lost son, King Alonso repents his injustice toward Prospero and asks forgiveness.',
      },
      {
        id: 'forgiveness-return',
        order: 5,
        pageRef: 'p. 24',
        title: 'Forgiveness, Freedom & Voyage Home',
        viewA: 'I choose noble mercy over revenge, forgive my brother, bury my magic staff, and set faithful Ariel free.',
        viewB: 'King Alonso is overjoyed to find Ferdinand alive with Miranda; the restored ship prepares for a calm voyage back to Milan.',
      },
    ],
    scrambledOrder: ['ferdinand-test', 'enchanted-storm', 'forgiveness-return', 'exile-story', 'repentance-trial'],
    successSeqMsg:
      '✓ Exact dramatic arc of The Tempest! Storm → Past exile revealed → Ferdinand’s test → Repentance → Forgiveness & Ariel’s freedom.',
    vocabTitle: 'Match Unit 1 Supplementary Glossary Terms — The Tempest (pp. 21–24)',
    vocabPairs: [
      { id: 'torment', word: 'Torment (v./n.)', meaning: 'To cause severe distress or suffering (p. 21)' },
      { id: 'usurp', word: 'Usurp (v.)', meaning: 'To seize a throne or position of power unlawfully (p. 22)' },
      { id: 'penitent', word: 'Penitent (adj.)', meaning: 'Feeling genuine sorrow and regret for past wrongs (p. 23)' },
      { id: 'dreadful', word: 'Dreadful (adj.)', meaning: 'Causing great fear, awe, or alarm during the storm (p. 21)' },
    ],
    referenceTitle: 'Key Characters & Roles in The Tempest (pp. 21–24)',
    referenceCols: ['Character', 'Role', 'Core Motivation', 'Resolution'],
    referenceRows: [
      ['Prospero', 'Rightful Duke of Milan', 'Restore justice through mercy, not cruelty', 'Forgives brother; sets Ariel free'],
      ['Miranda', 'Prospero’s daughter', 'Compassion for others & sincere love', 'Betrothed to Prince Ferdinand'],
      ['Ariel', 'Gentle spirit of the air', 'Serve Prospero faithfully to earn liberty', 'Granted full freedom at the end'],
      ['Antonio & Alonso', 'Usurper & King of Naples', 'Past ambition giving way to conscience', 'Repent & reconcile with Prospero'],
    ],
  },
  ghost: {
    title: 'The Night the Ghost Got In & The Grumble Family (Unit 2)',
    pageRange: 'pp. 30–49',
    perspectiveALabel: 'Narrator (James Thurber) & Mother',
    perspectiveBLabel: 'Grandfather & Police Officers',
    events: [
      { id: 'footsteps', order: 1, pageRef: 'p. 30', title: 'Rhythmic Footsteps Circle the Dining Table', viewA: 'Stepping out of the bath at 1:15 a.m., I hear rapid footsteps circling downstairs and wake my brother Herman.', viewB: 'Grandfather sleeps upstairs in the attic, convinced Civil War troops are retreating.' },
      { id: 'shoe-window', order: 2, pageRef: 'p. 31', title: 'Mother Throws a Shoe Through Bodwell’s Window', viewA: 'Mother insists burglars are downstairs and hurls a shoe through the neighbour’s pane to summon police.', viewB: 'Mr. Bodwell shouts in shock before phoning police headquarters.' },
      { id: 'police-raid', order: 3, pageRef: 'p. 32', title: 'Police Smash the Front Door & Search', viewA: 'Officers ransack closets and yank down curtains while reporters listen closely.', viewB: 'Searching every room yields no burglar — only confusion over the slammed door.' },
      { id: 'attic-shot', order: 4, pageRef: 'p. 33', title: 'Grandfather Mistakes Police for Deserters', viewA: 'Chaos erupts in the attic when Grandfather grabs a police pistol thinking General Meade’s men are fleeing!', viewB: 'The baffled cops quickly retreat downstairs nursing a bruised hand and shaken pride.' },
      { id: 'morning-clue', order: 5, pageRef: 'p. 34', title: 'Morning Reveal at the Breakfast Table', viewA: 'Next morning Grandfather casually asks what the cops wanted — he had gone downstairs for water!', viewB: 'Comic irony resolves the midnight hullabaloo: it was Grandfather all along.' },
    ],
    scrambledOrder: ['police-raid', 'footsteps', 'morning-clue', 'shoe-window', 'attic-shot'],
    successSeqMsg: '✓ Exact comic sequence! Footsteps → Shoe through window → Police raid → Attic clash → Morning reveal.',
    vocabTitle: 'Match Unit 2 Glossary Terms (p. 34)',
    vocabPairs: [
      { id: 'hullabaloo', word: 'Hullabaloo (n.)', meaning: 'A loud, confused uproar or commotion (p. 34)' },
      { id: 'patrolman', word: 'Patrolman (n.)', meaning: 'A police officer assigned to guard a neighbourhood beat (p. 34)' },
      { id: 'attic', word: 'Attic (n.)', meaning: 'A room or space just below the roof of a house (p. 34)' },
      { id: 'indignant', word: 'Indignant (adj.)', meaning: 'Feeling anger at something perceived as unfair or absurd (p. 34)' },
    ],
    referenceTitle: 'Unit 2 Prose & Poem Contrast (pp. 30–46)',
    referenceCols: ['Text', 'Author', 'Central Theme', 'Tone / Style'],
    referenceRows: [
      ['The Night the Ghost Got In', 'James Thurber', 'Escalating misunderstanding & comic chaos', 'Humorous memoir'],
      ['The Grumble Family', 'L. M. Montgomery', 'Constant complaining steals everyday joy', 'Light satirical verse'],
      ['Zigzag', 'Asha Nehemiah', 'Finding the right environment unlocks hidden talent', 'Witty narrative'],
    ],
  },
  zigzag: {
    title: 'Zigzag (Supplementary by Asha Nehemiah · Unit 2)',
    pageRange: 'pp. 50–55',
    perspectiveALabel: 'Dr. Krishnan & Family',
    perspectiveBLabel: 'Zigzag & Dr. Somu',
    events: [
      { id: 'somu-gift', order: 1, pageRef: 'p. 50', title: 'Dr. Somu Leaves Zigzag with the Krishnans', viewA: 'Mrs. Krishnan worries the strange African bird will ruin her sunset painting for the exhibition.', viewB: 'Uncle Somu promises Zigzag can speak 21 languages and is an absolute treasure!' },
      { id: 'fruit-fan', order: 2, pageRef: 'p. 51', title: 'Guava & Papaya Stashed on Ceiling Fan Blades', viewA: 'Zigzag refuses to speak, hides fruit slices atop the fan, and falls into a deafening snore.', viewB: 'When the fan switches on, papaya splatters straight onto Mrs. Krishnan’s canvas!' },
      { id: 'clinic-move', order: 3, pageRef: 'p. 53', title: 'Dr. Krishnan Brings Zigzag to His Clinic', viewA: 'Exhausted by neighbours’ complaints, Dr. Krishnan reluctantly takes Zigzag to work.', viewB: 'The noisy waiting room filled with crying children instantly captures Zigzag’s attention.' },
      { id: 'order-clinic', order: 4, pageRef: 'p. 54', title: 'Zigzag Becomes the Star Clinic Assistant', viewA: 'Zigzag commands calm order, entertains anxious kids, and stops snoring completely!', viewB: 'Trained by an African witch-doctor, Zigzag thrives only when actively helping people.' },
      { id: 'painting-sold', order: 5, pageRef: 'p. 55', title: 'Splat-Art Masterpiece & Happy Ending', viewA: 'Mrs. Jhunjhunwala buys the papaya-streaked painting for ₹5,000! Everyone wants Zigzag to stay.', viewB: 'Zigzag proves that seemingly quirky talents shine in the right role.' },
    ],
    scrambledOrder: ['clinic-move', 'somu-gift', 'painting-sold', 'fruit-fan', 'order-clinic'],
    successSeqMsg: '✓ Exact Zigzag arc! Arrival → Fan chaos → Clinic visit → Star helper → Painting triumph.',
    vocabTitle: 'Match Zigzag Vocabulary (p. 55)',
    vocabPairs: [
      { id: 'aboriginal', word: 'Aboriginal (adj.)', meaning: 'Native or inhabiting a land from earliest times' },
      { id: 'sarcasm', word: 'Sarcasm (n.)', meaning: 'Irony used to mock or express irritation' },
      { id: 'grumpy', word: 'Grumpy (adj.)', meaning: 'Bad-tempered and easily annoyed' },
      { id: 'commotion', word: 'Commotion (n.)', meaning: 'A state of noisy disturbance and confusion' },
    ],
    referenceTitle: 'Character Growth in Zigzag (pp. 50–55)',
    referenceCols: ['Character', 'Initial Attitude', 'Turning Point', 'Outcome'],
    referenceRows: [
      ['Zigzag', 'Silent & loudly snoring at home', 'Enters noisy pediatric clinic', 'Becomes beloved, disciplined clinic star'],
      ['Mrs. Krishnan', 'Furious about ruined sunset canvas', 'Art critic praises the abstract streak', 'Delighted and asks to keep Zigzag'],
      ['Dr. Krishnan', 'Stressed between family & friend', 'Observes Zigzag calming patients', 'Realizes every creature needs purpose'],
    ],
  },
  navigating: {
    title: 'Empowered Women Navigating the World & Mulan (Unit 3)',
    pageRange: 'pp. 60–91',
    perspectiveALabel: 'INSV Tarini Crew (Lt. Cdr. Vartika Joshi)',
    perspectiveBLabel: 'Mission Milestones & Courage',
    events: [
      { id: 'selection', order: 1, pageRef: 'p. 60', title: 'Six Indian Navy Women Officers Selected', viewA: 'We trained three years in navigation, meteorology, and repairs to sail the 55-foot INSV Tarini.', viewB: 'Navika Sagar Parikrama was India’s first all-women circumnavigation expedition.' },
      { id: 'goa-launch', order: 2, pageRef: 'p. 61', title: 'Flagged Off from Goa (10 September 2017)', viewA: 'We cast off into the Indian Ocean relying solely on wind energy and teamwork.', viewB: 'Route planned across 5 stopovers: Fremantle, Lyttelton, Port Stanley, Cape Town, Mauritius.' },
      { id: 'cape-horn', order: 3, pageRef: 'p. 63', title: 'Braving 60-Knot Storms in the South Pacific', viewA: 'Waves towered nine metres high near Cape Horn; calm collaboration kept every sail intact.', viewB: 'They collected meteorological and ocean-pollution data for IMD throughout the voyage.' },
      { id: 'diwali-sea', order: 4, pageRef: 'p. 64', title: 'Celebrating Festivals & Crafts Mid-Ocean', viewA: 'Baking cakes, reading books, and sharing regional Tamil/Indian dishes kept morale high.', viewB: 'Demonstrated that skill, grit, and leadership transcend gender stereotypes.' },
      { id: 'goa-return', order: 5, pageRef: 'p. 65', title: 'Triumphant Return After 254 Days (21 May 2018)', viewA: 'Sailing back into Goa after 21,600 nautical miles proved women can conquer any ocean.', viewB: 'Honoured with the Nari Shakti Puraskar for historic maritime excellence.' },
    ],
    scrambledOrder: ['cape-horn', 'selection', 'goa-return', 'goa-launch', 'diwali-sea'],
    successSeqMsg: '✓ Exact voyage timeline! Training → Goa launch → Cape Horn storms → Mid-ocean resilience → 254-day return.',
    vocabTitle: 'Match Maritime & Unit 3 Vocabulary (p. 65)',
    vocabPairs: [
      { id: 'circumnavigate', word: 'Circumnavigate (v.)', meaning: 'To sail completely around the globe (p. 65)' },
      { id: 'indigenously', word: 'Indigenously (adv.)', meaning: 'Naturally produced or built within one’s own country (p. 65)' },
      { id: 'consortia', word: 'Expedition (n.)', meaning: 'A planned journey undertaken for exploration or research' },
      { id: 'morale', word: 'Morale (n.)', meaning: 'Confidence, enthusiasm, and discipline of a team (p. 65)' },
    ],
    referenceTitle: 'Unit 3 Women Empowerment Trilogy (pp. 60–91)',
    referenceCols: ['Text', 'Heroine(s)', 'Core Strength', 'Key Takeaway'],
    referenceRows: [
      ['Empowered Women Navigating', 'INSV Tarini 6-woman crew', 'Maritime navigation & storm resilience', '254 days around the world'],
      ['I am Every Woman (Poem)', 'Rakhi Nariani Shirke', 'Persistence, grace & fearless dignity', 'Respect women’s inner strength'],
      ['The Story of Mulan', 'Hua Mulan', 'Filial love, strategy & bravery', 'Courage outshines prejudice'],
    ],
  },
  attic: {
    title: 'The Attic, Ant & Cricket, and Aged Mother (Unit 4)',
    pageRange: 'pp. 94–123',
    perspectiveALabel: 'Aditya Narayan Chowdhury',
    perspectiveBLabel: 'Sasanka Sanyal',
    events: [
      { id: 'teashop', order: 1, pageRef: 'p. 95', title: 'Meeting Sanyal at Nagen Uncle’s Tea Shop', viewA: 'On visiting Bramhapur, I hear an elderly man recite Tagore’s poem and suddenly freeze in guilt.', viewB: 'Sasanka Sanyal recognizes Aditya’s face from 29 years earlier in school.' },
      { id: 'old-house', order: 2, pageRef: 'p. 96', title: 'Searching the Ancestral Attic in Bramhapur', viewA: 'I climb past crumbling bricks to the attic ventilator to recover what I hid as a jealous boy.', viewB: 'The hidden heirloom is Sanyal’s prized silver medal won for recitation in 1948.' },
      { id: 'medal-found', order: 3, pageRef: 'p. 97', title: 'Uncovering the 1948 Silver Medal', viewA: 'Covered in dust inside a ventilator hole lies the engraved medal; I weigh it at the jeweller’s.', viewB: 'Money alone cannot erase betrayal, yet honest confession can heal decades of pain.' },
      { id: 'confession', order: 4, pageRef: 'p. 98', title: 'Offering ₹150 & Confessing the Truth', viewA: 'I hand Sanyal ₹150 as the medal’s cash value, admitting I stole it out of boyish envy.', viewB: 'Sanyal refuses the money firmly — he wants only the medal itself to restore his dignity.' },
      { id: 'redemption', order: 5, pageRef: 'p. 99', title: 'Returning the Silver Medal & Earning Peace', viewA: 'I present the real engraved medal; lifting that 29-year secret restores my integrity.', viewB: 'True repentance means owning past mistakes honestly rather than buying silence.' },
    ],
    scrambledOrder: ['medal-found', 'teashop', 'redemption', 'old-house', 'confession'],
    successSeqMsg: '✓ Exact arc of The Attic! Tea shop recognition → Attic search → Medal found → Confession → Honest redemption.',
    vocabTitle: 'Match Unit 4 Glossary Terms (p. 99)',
    vocabPairs: [
      { id: 'bifurcated', word: 'Bifurcated (v.)', meaning: 'Divided into two separate branches or roads (p. 99)' },
      { id: 'revive', word: 'Revive (v.)', meaning: 'To bring back to life, memory, or consciousness (p. 99)' },
      { id: 'soothing', word: 'Soothing (adj.)', meaning: 'Making someone feel calm and comforted' },
      { id: 'dilated', word: 'Dilated (v.)', meaning: 'Became wider or larger in sudden recognition (p. 99)' },
    ],
    referenceTitle: 'Unit 4 Moral & Wisdom Stories (pp. 94–123)',
    referenceCols: ['Text', 'Author', 'Core Moral', 'Key Symbol'],
    referenceRows: [
      ['The Attic', 'Satyajit Ray', 'Conscience & honest reparation outweigh wealth', '1948 Silver Medal'],
      ['The Ant and the Cricket', 'Adapted from Aesop', 'Diligent preparation prevents future hardship', 'Winter storehouse'],
      ['The Aged Mother', 'Matsuo Basho', 'Wisdom of elders saves the entire village', 'Twigs & rope of ashes'],
    ],
  },
  tech: {
    title: 'Tech Bloomers & The Secret of the Machines (Unit 5)',
    pageRange: 'pp. 126–157',
    perspectiveALabel: 'Alisha & David (Assistive Tech Users)',
    perspectiveBLabel: 'Machines & Responsible Engineering',
    events: [
      { id: 'assistive-need', order: 1, pageRef: 'p. 126', title: 'Breaking Barriers with Assistive Technology', viewA: 'Typing was exhausting due to cerebral palsy until Dragon Dictate turned my spoken words into text.', viewB: 'Technology turns disability into independence when designed inclusively.' },
      { id: 'david-liberator', order: 2, pageRef: 'p. 127', title: 'David Speaks via Liberator & ECO2 Eye-Gaze', viewA: 'With ACTIV controller and Liberator Communication Device, I converse, control TV, and play sports!', viewB: 'Switch-access and eye-tracking open full education and social inclusion.' },
      { id: 'kim-support', order: 3, pageRef: 'p. 128', title: 'Kim — Assistive Technologist Guiding Learners', viewA: 'Pairing the right tool with each student’s strengths makes learning joyful and barrier-free.', viewB: 'Every gadget obeys human engineering: "Give us water, coal, and oil, and we will serve 24 hours."' },
      { id: 'machine-law', order: 4, pageRef: 'p. 148', title: 'Kipling’s Warning: Machines Lack Pity or Love', viewA: 'We must operate technology safely and ethically; machines obey physical laws without forgiveness.', viewB: 'In "The Secret of the Machines", Kipling reminds us machines are creations of the human brain.' },
      { id: 'future-2889', order: 5, pageRef: 'p. 153', title: 'Vision of the Future (A Day in 2889)', viewA: 'From phonotelephote video calls to aero-cars, human imagination drives scientific progress.', viewB: 'Responsible innovation empowers humanity while keeping human empathy in command.' },
    ],
    scrambledOrder: ['kim-support', 'assistive-need', 'future-2889', 'david-liberator', 'machine-law'],
    successSeqMsg: '✓ Exact Unit 5 progression! Assistive tech → Liberator/Eye-gaze → Inclusive mentoring → Machine ethics → Future vision.',
    vocabTitle: 'Match Unit 5 Technology Vocabulary (pp. 129, 148)',
    vocabPairs: [
      { id: 'grapple', word: 'Grapple (v.)', meaning: 'To struggle or deal actively with a difficult challenge' },
      { id: 'inclusion', word: 'Inclusion (n.)', meaning: 'Ensuring every learner participates equally without barriers' },
      { id: 'furnace', word: 'Furnace (n.)', meaning: 'An enclosed chamber where metal ore is melted at high heat (p. 148)' },
      { id: 'wrought', word: 'Wrought (v.)', meaning: 'Shaped or hammered into form by metalworking (p. 148)' },
    ],
    referenceTitle: 'Unit 5 Tech & Ethics Overview (pp. 126–157)',
    referenceCols: ['Text', 'Focus', 'Key Tool / Concept', 'Human Lesson'],
    referenceRows: [
      ['Tech Bloomers', 'Inclusive Assistive Tech', 'Dragon Dictate, Liberator, Eye-Gaze', 'Tech empowers differently abled achievers'],
      ['Secret of the Machines', 'Rudyard Kipling (Poem)', 'Furnace, levers, steam & laws of physics', 'Machines are servants, never masters'],
      ['A Day in 2889', 'Jules Verne', 'Phonotelephote, aero-trains, Earth Herald', 'Sci-fi foresight of global media'],
    ],
  },
  lastlesson: {
    title: 'The Last Lesson & No Men Are Foreign (Unit 6)',
    pageRange: 'pp. 162–186',
    perspectiveALabel: 'Little Franz (Student)',
    perspectiveBLabel: 'M. Hamel (French Teacher)',
    events: [
      { id: 'late-school', order: 1, pageRef: 'p. 162', title: 'Franz Hurries Past the Crowded Bulletin Board', viewA: 'I dreaded being questioned on participles and noticed Prussian soldiers drilling behind the sawmill.', viewB: 'An order from Berlin had just arrived banning French instruction in Alsace and Lorraine.' },
      { id: 'quiet-class', order: 2, pageRef: 'p. 163', title: 'Unusual Silence & Village Elders on Back Benches', viewA: 'School feels quiet as Sunday morning; M. Hamel wears his green ceremonial coat and frilled shirt.', viewB: 'Old Hauser, the former Mayor, and villagers sit silently to honour 40 years of faithful teaching.' },
      { id: 'final-notice', order: 3, pageRef: 'p. 164', title: '“My Children, This Is Your Last French Lesson”', viewA: 'The words strike like a thunderclap — suddenly my grammar books feel like old friends I cannot lose!', viewB: 'I urge everyone to guard their mother tongue, calling it the key to their prison.' },
      { id: 'deep-focus', order: 4, pageRef: 'p. 165', title: 'Franz Understands Every Grammar Rule Clearly', viewA: 'Never had I listened so attentively, nor had M. Hamel explained with such gentle patience.', viewB: 'Every student writes “France, Alsace” in neat round hand as pigeons coo softly on the roof.' },
      { id: 'vive-la-france', order: 5, pageRef: 'p. 166', title: 'Church Clock Strikes Twelve: “Vive La France!”', viewA: 'Choked with emotion, M. Hamel writes huge chalk letters on the blackboard and dismisses us silently.', viewB: 'Language carries a community’s memory, identity, and quiet dignity across generations.' },
    ],
    scrambledOrder: ['final-notice', 'late-school', 'vive-la-france', 'quiet-class', 'deep-focus'],
    successSeqMsg: '✓ Exact arc of The Last Lesson! Bulletin board → Silent class → Final announcement → Focused learning → Vive La France!',
    vocabTitle: 'Match Unit 6 Vocabulary (p. 166)',
    vocabPairs: [
      { id: 'apprentice', word: 'Apprentice (n.)', meaning: 'A person learning a trade from a skilled employer (p. 166)' },
      { id: 'nuisance', word: 'Nuisance (n.)', meaning: 'Something causing annoyance or inconvenience (p. 166)' },
      { id: 'cranky', word: 'Cranky (adj.)', meaning: 'Strange, eccentric, or easily irritated (p. 166)' },
      { id: 'angelus', word: 'Angelus (n.)', meaning: 'A midday Roman Catholic church bell devotion (p. 166)' },
    ],
    referenceTitle: 'Unit 6 Identity, Peace & Courage (pp. 162–186)',
    referenceCols: ['Text', 'Author', 'Core Theme', 'Memorable Moment'],
    referenceRows: [
      ['The Last Lesson', 'Alphonse Daudet', 'Value of mother tongue & linguistic freedom', 'M. Hamel writes "Vive La France!"'],
      ['No Men Are Foreign', 'James Kirkup', 'Universal human brotherhood beyond borders', 'All breathe the same air & share one earth'],
      ['Little Hero of Holland', 'Mary Mapes Dodge', 'Selfless civic duty & perseverance', 'Peter plugs the leaking dike all night'],
    ],
  },
  detective: {
    title: 'The Dying Detective & House on Elm Street (Unit 7)',
    pageRange: 'pp. 189–209',
    perspectiveALabel: 'Dr. John Watson',
    perspectiveBLabel: 'Sherlock Holmes (Master Strategist)',
    events: [
      { id: 'hudson-call', order: 1, pageRef: 'p. 189', title: 'Mrs. Hudson Summons Watson in Alarm', viewA: 'She tells me Holmes has been dying for three days of a deadly Sumatran fever and refuses any doctor!', viewB: 'Three days of fasting and vaseline/beeswax makeup make my illness look utterly convincing.' },
      { id: 'ivory-box', order: 2, pageRef: 'p. 191', title: 'Holmes Forbids Watson to Touch the Ivory Box', viewA: 'Holmes cries out fiercely when I near a tiny black-and-white ivory box on the mantelpiece.', viewB: 'That box holds the poisoned spring Culverton Smith mailed to murder me — vital evidence!' },
      { id: 'fetch-smith', order: 3, pageRef: 'p. 192', title: 'Watson Fetches Planter Culverton Smith', viewA: 'Following strict instructions, I plead with Smith to come at 6 p.m., then return ahead and hide behind the bed.', viewB: 'Only Smith’s vanity and belief that I am helpless will make him confess aloud.' },
      { id: 'confession-trap', order: 4, pageRef: 'p. 194', title: 'Smith Confesses Murdering Victor Savage', viewA: 'Hidden behind the headboard, I hear Smith gloat about killing his nephew and mailing the poisoned box!', viewB: 'I ask Smith to turn up the gas lamp — my pre-arranged signal to Inspector Morton waiting outside.' },
      { id: 'arrest', order: 5, pageRef: 'p. 195', title: 'Inspector Morton Enters & Arrests Smith', viewA: 'Holmes leaps up healthy, revealing his clever ruse, and praises my role as witness!', viewB: 'Cool deduction and verifiable evidence defeat crime without reckless force.' },
    ],
    scrambledOrder: ['fetch-smith', 'hudson-call', 'arrest', 'ivory-box', 'confession-trap'],
    successSeqMsg: '✓ Case solved! Mrs. Hudson’s alarm → Ivory box clue → Fetching Smith → Gas-lamp confession → Morton’s arrest.',
    vocabTitle: 'Match Unit 7 Detective Vocabulary (p. 196)',
    vocabPairs: [
      { id: 'gaunt', word: 'Gaunt (adj.)', meaning: 'Lean, haggard, and pale as if from illness or hunger (p. 196)' },
      { id: 'twitched', word: 'Twitched (v.)', meaning: 'Gave a sudden jerky movement (p. 196)' },
      { id: 'contagious', word: 'Contagious (adj.)', meaning: 'Spreading from one person to another by contact (p. 196)' },
      { id: 'groan', word: 'Dejection (n.)', meaning: 'A sad, depressed, or downcast state of mind' },
    ],
    referenceTitle: 'Unit 7 Mystery & Suspense Overview (pp. 189–209)',
    referenceCols: ['Text', 'Author', 'Central Mystery', 'Resolution'],
    referenceRows: [
      ['The Dying Detective', 'Arthur Conan Doyle', 'Is Holmes truly dying of tropical fever?', 'Feigned illness traps Culverton Smith'],
      ['The House on Elm Street', 'Nadia Bush', 'Why does the leafless tree never grow or die?', 'Unresolved eerie mystery of the house'],
      ['A Dilemma', 'Silas Weir Mitchell', 'How to open Uncle Philip’s explosive ruby box?', 'Tom chooses safety over risky greed'],
    ],
  },
};

function resolveEnglishVariant(sectionId: string): English3DVariant {
  const id = sectionId.toLowerCase();
  if (id.startsWith('english-02')) return id.includes('supplementary') ? 'zigzag' : 'ghost';
  if (id.startsWith('english-03')) return 'navigating';
  if (id.startsWith('english-04')) return 'attic';
  if (id.startsWith('english-05')) return 'tech';
  if (id.startsWith('english-06')) return 'lastlesson';
  if (id.startsWith('english-07')) return 'detective';
  if (id.includes('poem')) return 'life';
  if (id.includes('supplementary')) return 'tempest';
  return 'flight';
}

export function StoryStageEngine({
  sectionId,
  mode,
  reducedMotion,
  onInteract,
  onComplete,
}: ModularEngineProps) {
  const variant: English3DVariant = resolveEnglishVariant(sectionId);

  const data = STORY_DATASETS[variant];

  const [subTab, setSubTab] = useState<'perspectives' | 'sequence' | 'vocab'>('perspectives');
  const [perspective, setPerspective] = useState<'A' | 'B'>('A');
  const [beatIndex, setBeatIndex] = useState(0);
  const [orderedIds, setOrderedIds] = useState<string[]>(data.scrambledOrder);
  const [checkedSeq, setCheckedSeq] = useState(false);

  // Vocabulary matcher state
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [matchedVocab, setMatchedVocab] = useState<Record<string, boolean>>({});
  const [vocabFeedback, setVocabFeedback] = useState<string>('');

  // Reset puzzle & beat state whenever learner navigates between Prose / Poem / Supplementary!
  useEffect(() => {
    setBeatIndex(0);
    setPerspective('A');
    setOrderedIds(STORY_DATASETS[variant].scrambledOrder);
    setCheckedSeq(false);
    setSelectedWordId(null);
    setMatchedVocab({});
    setVocabFeedback('');
  }, [variant]);

  const moveEvent = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrderedIds(next);
    setCheckedSeq(false);
    onInteract();
  };

  const seqExact = orderedIds.every((id, i) => {
    const ev = data.events.find((e) => e.id === id);
    return ev?.order === i + 1;
  });

  const handleVocabMeaningClick = (meaningId: string) => {
    if (!selectedWordId) {
      setVocabFeedback('First choose a word on the left, then select its matching definition.');
      return;
    }
    onInteract();
    if (selectedWordId === meaningId) {
      const next = { ...matchedVocab, [selectedWordId]: true };
      setMatchedVocab(next);
      setSelectedWordId(null);
      setVocabFeedback('✓ Exact glossary match!');
      if (data.vocabPairs.every((v) => next[v.id])) {
        onComplete(`Matched all 4 contextual vocabulary terms from ${data.title}!`);
      }
    } else {
      setVocabFeedback(`Not quite — check how the word is used on textbook ${data.pageRange} and try again.`);
    }
  };

  const activeBeat = data.events[Math.min(data.events.length - 1, beatIndex)];
  const [altEnding, setAltEnding] = useState('');

  // Custom Illustrated 2D Scene Progress Coordinates (0% 3D — warm storybook SVG!)
  const seagullPos: [number, number][] = [
    [98, 96],   // Scene 1: Retreating on cliff ledge
    [135, 92],  // Scene 2: Alone on ledge looking across chasm
    [205, 86],  // Scene 3: Mother hovers with fish just beyond brink
    [298, 72],  // Scene 4: Plunging & soaring on outstretched wings!
    [392, 160], // Scene 5: Floating safely on the green sea
  ];
  const [gx, gy] = seagullPos[Math.min(4, beatIndex)];

  return (
    <div className="space-y-4">
      {/* Illustrated 2D 5-Scene Interactive Storyboard (0% forced 3D!) */}
      <div className="p-4 sm:p-5 rounded-[20px] border border-[var(--line)] bg-[var(--english-tint)]/55 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--english)] inline-flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5" />
            <span>Illustrated 2D Storyboard · {data.title} ({data.pageRange})</span>
          </span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select story scene">
            {data.events.map((ev, b) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  setBeatIndex(b);
                  onInteract();
                }}
                aria-pressed={beatIndex === b}
                className={`px-3 py-1.5 min-h-[34px] rounded-lg text-xs font-bold border transition-colors ${beatIndex === b
                  ? 'bg-[var(--english)] text-white border-[var(--english)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--english)]'
                  }`}
              >
                Scene {b + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden p-2">
          <svg
            viewBox="0 0 520 205"
            className="w-full h-auto rounded-xl"
            role="img"
            aria-label={`Illustrated 2D storyboard Scene ${beatIndex + 1}: ${activeBeat.title}`}
          >
            {/* Warm Sky Gradient */}
            <defs>
              <linearGradient id="storySky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={beatIndex >= 3 ? '#DBEAFE' : '#FEF3C7'} />
                <stop offset="100%" stopColor="#EFF6FF" />
              </linearGradient>
              <linearGradient id="storySea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="520" height="205" fill="url(#storySky)" />
            {/* Sun */}
            <circle cx="458" cy="40" r="22" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
            {/* Green Sea */}
            <rect x="0" y="152" width="520" height="53" fill="url(#storySea)" />
            <path d="M 0 165 Q 65 157 130 165 T 260 165 T 390 165 T 520 165" fill="none" stroke="#99F6E4" strokeWidth="2" opacity="0.6" />

            {/* Left High Cliff Ledge */}
            <path d="M 0 105 L 158 105 L 178 154 L 0 154 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <path d="M 0 105 L 158 105 L 150 116 L 0 116 Z" fill="#CBD5E1" />
            <text x="72" y="138" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#1E293B">
              {variant === 'flight' ? 'High Cliff Ledge' : 'Opening Setting'}
            </text>

            {/* Flight Trajectory Dotted Arc */}
            <path
              d="M 110 96 Q 210 56 300 72 T 392 158"
              fill="none"
              stroke="#3478C0"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.7"
            />

            {/* Mother Seagull hovering on Scene 3+ */}
            {variant === 'flight' && beatIndex >= 2 && (
              <g transform="translate(242, 62)">
                <path d="M -22 4 Q -10 -12 0 0 Q 10 -12 22 4" fill="none" stroke="#1E3A8A" strokeWidth="3.2" strokeLinecap="round" />
                <circle cx="0" cy="2" r="4" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="1.5" />
                {beatIndex === 2 && <ellipse cx="7" cy="9" rx="7" ry="3" fill="#F59E0B" />}
                <text x="0" y="-12" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#1E3A8A">
                  Mother {beatIndex === 2 ? '(with fish)' : '(soaring beside)'}
                </text>
              </g>
            )}

            {/* Protagonist Marker / Young Seagull */}
            <g transform={`translate(${gx}, ${gy})`}>
              <circle cx="0" cy="0" r="18" fill="#3478C0" fillOpacity="0.16" />
              <path
                d={beatIndex >= 3 ? 'M -24 -4 Q -12 -18 0 -2 Q 12 -18 24 -4' : 'M -14 4 Q -6 -6 0 2 Q 6 -6 14 4'}
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="0" cy="0" r="5" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2" />
              <text x="0" y="24" textAnchor="middle" fontSize="10" fontWeight="800" fill="#13213A">
                {variant === 'flight' ? 'Young Seagull' : `Scene ${beatIndex + 1}`}
              </text>
            </g>

            {/* Scene Progress Caption Strip */}
            <rect x="14" y="12" width="320" height="32" rx="10" fill="#FFFFFF" fillOpacity="0.92" stroke="#DDE4F0" />
            <text x="26" y="32" fontSize="11.5" fontWeight="800" fill="#13213A">
              Beat {beatIndex + 1} / {data.events.length}: {activeBeat.title} ({activeBeat.pageRef})
            </text>
          </svg>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
          <strong className="text-[var(--english)]">
            {perspective === 'A' ? data.perspectiveALabel : data.perspectiveBLabel} ({activeBeat.pageRef}):
          </strong>{' '}
          {perspective === 'A' ? activeBeat.viewA : activeBeat.viewB}
        </div>

        {/* Optional Local-Only Creative Alternate-Ending Prompt (Pilot 3 Playability Spec) */}
        {variant === 'flight' && (
          <details className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-xs">
            <summary className="cursor-pointer font-extrabold text-[var(--english)]">
              Creative Studio: Write a 2-sentence alternate ending (distinct from Liam O’Flaherty’s plot)
            </summary>
            <div className="mt-2.5 space-y-2">
              <p className="text-[var(--text-muted)]">
                What if the mother had dropped the fish directly onto the ledge instead of halting just out of reach? How would the theme of courage change?
              </p>
              <textarea
                rows={2}
                value={altEnding}
                onChange={(e) => setAltEnding(e.target.value)}
                placeholder="Draft your creative alternate ending here (stays private on your device)..."
                className="w-full p-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] text-xs text-[var(--ink)]"
              />
              {altEnding.trim().length > 12 && (
                <div className="text-[11px] font-bold text-[var(--success)]">
                  ✓ Creative draft noted! Compare your version with O’Flaherty’s original theme of self-reliance (pp. 2–5).
                </div>
              )}
            </div>
          </details>
        )}
      </div>

      {/* Sub-mode selector + Unit 1 Companion Links */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="StoryStage learning modes"
          className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]"
        >
          {(
            [
              ['perspectives', '1. Viewpoints'],
              ['sequence', '2. Story Order Puzzle'],
              ['vocab', '3. Vocabulary & Craft'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSubTab(id);
                onInteract();
              }}
              aria-pressed={subTab === id}
              className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs sm:text-sm font-bold transition-colors ${subTab === id
                ? 'bg-[var(--english)] text-white'
                : 'text-[var(--ink)] hover:bg-[var(--surface)]'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          {variant !== 'flight' && (
            <Link
              to="/class-10/english/english-01/english-01-prose"
              className="px-3 py-1.5 rounded-lg bg-[var(--english-tint)] text-[var(--english)] hover:underline inline-flex items-center gap-1"
            >
              <span>Prose: His First Flight</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {variant !== 'life' && (
            <Link
              to="/class-10/english/english-01/english-01-poem"
              className="px-3 py-1.5 rounded-lg bg-[var(--english-tint)] text-[var(--english)] hover:underline inline-flex items-center gap-1"
            >
              <span>Poem: Life</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {variant !== 'tempest' && (
            <Link
              to="/class-10/english/english-01/english-01-supplementary"
              className="px-3 py-1.5 rounded-lg bg-[var(--english-tint)] text-[var(--english)] hover:underline inline-flex items-center gap-1"
            >
              <span>Supplementary: The Tempest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* TAB 1: PERSPECTIVES */}
      {subTab === 'perspectives' && (
        <div className="p-4 sm:p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-extrabold text-[var(--ink)]">
                Compare Viewpoints in {data.title} ({data.pageRange})
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                Click any scene card below to jump the 3D diorama directly to that beat!
              </p>
            </div>
            <div className="inline-flex gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
              <button
                type="button"
                onClick={() => {
                  setPerspective('A');
                  onInteract();
                }}
                aria-pressed={perspective === 'A'}
                className={`px-3.5 py-2 min-h-[36px] rounded-lg text-xs font-bold ${perspective === 'A' ? 'bg-[var(--english)] text-white' : 'text-[var(--ink)]'
                  }`}
              >
                {data.perspectiveALabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPerspective('B');
                  onInteract();
                }}
                aria-pressed={perspective === 'B'}
                className={`px-3.5 py-2 min-h-[36px] rounded-lg text-xs font-bold ${perspective === 'B' ? 'bg-[var(--english)] text-white' : 'text-[var(--ink)]'
                  }`}
              >
                {data.perspectiveBLabel}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {data.events.map((ev, idx) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  setBeatIndex(idx);
                  onInteract();
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 text-xs transition-all ${beatIndex === idx
                  ? 'bg-[var(--surface)] border-[var(--english)] ring-2 ring-[var(--english)]/20'
                  : 'bg-[var(--surface)] border-[var(--line)] hover:border-[var(--english)]'
                  }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono-tabular font-bold text-[var(--english)]">
                    <span>Scene {ev.order}</span>
                    <span>{ev.pageRef}</span>
                  </div>
                  <h5 className="font-extrabold text-[var(--ink)] leading-snug">{ev.title}</h5>
                  <p className="text-[var(--text)] leading-relaxed">
                    {perspective === 'A' ? ev.viewA : ev.viewB}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SEQUENCE PUZZLE */}
      {subTab === 'sequence' && (
        <div className="p-4 sm:p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-4">
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-[var(--ink)]">
              Reconstruct the 5-Stage Arc of {data.title}
            </h4>
            <p className="text-xs text-[var(--text)]">
              Arrange all 5 scenes from opening beat (1) to resolution (5) using Up/Down arrows.
            </p>
          </div>

          <ol className="space-y-2">
            {orderedIds.map((id, idx) => {
              const ev = data.events.find((e) => e.id === id);
              if (!ev) return null;
              const ok = checkedSeq && ev.order === idx + 1;
              const bad = checkedSeq && ev.order !== idx + 1;
              return (
                <li
                  key={id}
                  className={`p-3 rounded-xl border bg-[var(--surface)] flex items-center justify-between gap-3 ${ok
                    ? 'border-[var(--success)] bg-[var(--success-bg)]/40'
                    : bad
                      ? 'border-[var(--warning)] bg-[var(--warning-bg)]/50'
                      : 'border-[var(--line)]'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[var(--surface-subtle)] border border-[var(--line)] text-xs font-extrabold text-[var(--ink)] inline-flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-extrabold text-[var(--ink)]">
                        {ev.title}{' '}
                        <span className="text-xs font-mono-tabular font-normal text-[var(--text-muted)]">
                          ({ev.pageRef})
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text)]">{ev.viewA}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveEvent(idx, -1)}
                      aria-label={`Move "${ev.title}" earlier`}
                      className="min-w-[36px] min-h-[36px] rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] inline-flex items-center justify-center disabled:opacity-35"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === orderedIds.length - 1}
                      onClick={() => moveEvent(idx, 1)}
                      aria-label={`Move "${ev.title}" later`}
                      className="min-w-[36px] min-h-[36px] rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] inline-flex items-center justify-center disabled:opacity-35"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setCheckedSeq(true);
                onInteract();
                if (seqExact) {
                  onComplete(`Reconstructed the full 5-stage arc of ${data.title}!`);
                }
              }}
              className="px-5 py-2.5 min-h-[42px] rounded-xl bg-[var(--english)] text-white text-sm font-bold inline-flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check Story Order</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderedIds(data.scrambledOrder);
                setCheckedSeq(false);
              }}
              className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs font-semibold inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scramble</span>
            </button>
          </div>

          {checkedSeq && (
            <div
              role="status"
              className={`p-3.5 rounded-xl border text-sm ${seqExact
                ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)] font-bold'
                : 'bg-[var(--warning-bg)] border-[var(--warning)]/40 text-[var(--ink)]'
                }`}
            >
              {seqExact
                ? data.successSeqMsg
                : `Some scenes are out of causal order — follow the textbook page cues (${data.pageRange}) and try again.`}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VOCABULARY & CRAFT */}
      {subTab === 'vocab' && (
        <div className="p-4 sm:p-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] space-y-5">
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-[var(--ink)]">{data.vocabTitle}</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Select a word on the left, then select its matching contextual meaning on the right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {data.vocabPairs.map((item) => {
                const done = matchedVocab[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={done}
                    onClick={() => setSelectedWordId(item.id)}
                    aria-pressed={selectedWordId === item.id}
                    className={`w-full p-3 min-h-[42px] rounded-xl border text-left text-sm font-bold transition-colors ${done
                      ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--success)]'
                      : selectedWordId === item.id
                        ? 'bg-[var(--english)] text-white border-[var(--english)]'
                        : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--english)]'
                      }`}
                  >
                    {done ? '✓ ' : ''}
                    {item.word}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              {[...data.vocabPairs].reverse().map((item) => {
                const done = matchedVocab[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={done}
                    onClick={() => handleVocabMeaningClick(item.id)}
                    className={`w-full p-3 min-h-[42px] rounded-xl border text-left text-xs sm:text-sm transition-colors ${done
                      ? 'bg-[var(--success-bg)] border-[var(--success)]/40 text-[var(--ink)]'
                      : 'bg-[var(--surface)] text-[var(--text)] border-[var(--line)] hover:border-[var(--english)]'
                      }`}
                  >
                    {item.meaning}
                  </button>
                );
              })}
            </div>
          </div>

          {vocabFeedback && (
            <div role="status" className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm font-semibold text-[var(--ink)]">
              {vocabFeedback}
            </div>
          )}

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--english)]">
              {data.referenceTitle}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--ink)]">
                    {data.referenceCols.map((col) => (
                      <th key={col} className="py-2 pr-3 font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[var(--text)]">
                  {data.referenceRows.map((row) => (
                    <tr key={row[0]}>
                      <td className="py-2 pr-3 font-semibold text-[var(--ink)]">{row[0]}</td>
                      <td className="py-2 pr-3">{row[1]}</td>
                      <td className="py-2 pr-3">{row[2]}</td>
                      <td className="py-2">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
