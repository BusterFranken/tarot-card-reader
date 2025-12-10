// Complete Tarot deck with image mappings and meanings

export interface TarotCard {
  name: string
  image: string
  upright: string
  reversed: string
  category: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'
  number?: number
}

// Major Arcana
export const majorArcana: TarotCard[] = [
  { name: 'The Fool', image: '/cards/00-TheFool.png', upright: 'New beginnings, innocence, spontaneity, a free spirit', reversed: 'Recklessness, poor judgment, naivety, risk-taking', category: 'major', number: 0 },
  { name: 'The Magician', image: '/cards/01-TheMagician.png', upright: 'Manifestation, resourcefulness, power, inspired action', reversed: 'Manipulation, poor planning, untapped talents', category: 'major', number: 1 },
  { name: 'The High Priestess', image: '/cards/02-TheHighPriestess.png', upright: 'Intuition, sacred knowledge, inner voice, subconscious', reversed: 'Secrets, disconnected from intuition, withdrawal', category: 'major', number: 2 },
  { name: 'The Empress', image: '/cards/03-TheEmpress.png', upright: 'Femininity, beauty, nature, abundance, nurturing', reversed: 'Creative block, dependence on others, infertility', category: 'major', number: 3 },
  { name: 'The Emperor', image: '/cards/04-TheEmperor.png', upright: 'Authority, structure, control, fatherhood, stability', reversed: 'Domination, excessive control, rigidity, inflexibility', category: 'major', number: 4 },
  { name: 'The Hierophant', image: '/cards/05-TheHierophant.png', upright: 'Spiritual wisdom, religious beliefs, conformity, tradition', reversed: 'Personal beliefs, non-conformity, new methods', category: 'major', number: 5 },
  { name: 'The Lovers', image: '/cards/06-TheLovers.png', upright: 'Love, harmony, relationships, values alignment, choices', reversed: 'Self-love, disharmony, imbalance, misalignment', category: 'major', number: 6 },
  { name: 'The Chariot', image: '/cards/07-TheChariot.png', upright: 'Control, willpower, success, determination, direction', reversed: 'Lack of control, aggression, no direction, self-discipline', category: 'major', number: 7 },
  { name: 'Strength', image: '/cards/08-Strength.png', upright: 'Strength, courage, persuasion, influence, inner strength', reversed: 'Inner strength, self-doubt, weakness, raw emotion', category: 'major', number: 8 },
  { name: 'The Hermit', image: '/cards/09-TheHermit.png', upright: 'Soul searching, introspection, inner guidance, contemplation', reversed: 'Isolation, withdrawal, reclusion, loneliness', category: 'major', number: 9 },
  { name: 'Wheel of Fortune', image: '/cards/10-WheelOfFortune.png', upright: 'Good luck, karma, destiny, turning point, cycles', reversed: 'Bad luck, resistance to change, breaking cycles', category: 'major', number: 10 },
  { name: 'Justice', image: '/cards/11-Justice.png', upright: 'Justice, fairness, truth, cause and effect, accountability', reversed: 'Unfairness, lack of accountability, dishonesty', category: 'major', number: 11 },
  { name: 'The Hanged Man', image: '/cards/12-TheHangedMan.png', upright: 'Pause, surrender, letting go, new perspectives, waiting', reversed: 'Delays, resistance, stalling, indecision', category: 'major', number: 12 },
  { name: 'Death', image: '/cards/13-Death.png', upright: 'Endings, change, transformation, transition, letting go', reversed: 'Resistance to change, inability to move on, stagnation', category: 'major', number: 13 },
  { name: 'Temperance', image: '/cards/14-Temperance.png', upright: 'Balance, moderation, patience, purpose, harmony', reversed: 'Imbalance, excess, lack of long-term vision', category: 'major', number: 14 },
  { name: 'The Devil', image: '/cards/15-TheDevil.png', upright: 'Shadow self, attachment, addiction, restriction, materialism', reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment', category: 'major', number: 15 },
  { name: 'The Tower', image: '/cards/16-TheTower.png', upright: 'Sudden change, upheaval, chaos, revelation, awakening', reversed: 'Fear of change, personal transformation, averting disaster', category: 'major', number: 16 },
  { name: 'The Star', image: '/cards/17-TheStar.png', upright: 'Hope, faith, purpose, renewal, spirituality, inspiration', reversed: 'Lack of faith, despair, disconnected, discouragement', category: 'major', number: 17 },
  { name: 'The Moon', image: '/cards/18-TheMoon.png', upright: 'Illusion, fear, anxiety, subconscious, intuition, confusion', reversed: 'Release of fear, repressed emotion, inner confusion', category: 'major', number: 18 },
  { name: 'The Sun', image: '/cards/19-TheSun.png', upright: 'Positivity, fun, warmth, success, vitality, joy', reversed: 'Inner child, feeling down, overly optimistic', category: 'major', number: 19 },
  { name: 'Judgment', image: '/cards/20-Judgement.png', upright: 'Reflection, evaluation, awakening, absolution, rebirth', reversed: 'Lack of self awareness, doubt, self-loathing', category: 'major', number: 20 },
  { name: 'The World', image: '/cards/21-TheWorld.png', upright: 'Completion, accomplishment, travel, fulfillment, integration', reversed: 'Seeking personal closure, incomplete, shortcuts', category: 'major', number: 21 },
]

// Minor Arcana - Wands (Fire - Passion, Creativity, Action)
const wandsCards: TarotCard[] = [
  { name: 'Ace of Wands', image: '/cards/Wands01.png', upright: 'Inspiration, new opportunities, potential, growth', reversed: 'Lack of direction, delays, creative blocks', category: 'wands', number: 1 },
  { name: 'Two of Wands', image: '/cards/Wands02.png', upright: 'Planning, discovery, personal power, future planning', reversed: 'Lack of planning, fear of unknown, no direction', category: 'wands', number: 2 },
  { name: 'Three of Wands', image: '/cards/Wands03.png', upright: 'Exploration, expansion, foresight, leadership', reversed: 'Lack of foresight, delays, obstacles', category: 'wands', number: 3 },
  { name: 'Four of Wands', image: '/cards/Wands04.png', upright: 'Celebration, harmony, home, community', reversed: 'Lack of support, instability, transience', category: 'wands', number: 4 },
  { name: 'Five of Wands', image: '/cards/Wands05.png', upright: 'Competition, conflict, tension, disagreements', reversed: 'Avoiding conflict, tension, competition', category: 'wands', number: 5 },
  { name: 'Six of Wands', image: '/cards/Wands06.png', upright: 'Victory, success, public recognition, progress', reversed: 'Lack of recognition, private success, fall from grace', category: 'wands', number: 6 },
  { name: 'Seven of Wands', image: '/cards/Wands07.png', upright: 'Challenge, competition, protection, perseverance', reversed: 'Giving up, overwhelmed, defensive', category: 'wands', number: 7 },
  { name: 'Eight of Wands', image: '/cards/Wands08.png', upright: 'Rapid action, movement, quick decisions, progress', reversed: 'Delays, frustration, lack of direction', category: 'wands', number: 8 },
  { name: 'Nine of Wands', image: '/cards/Wands09.png', upright: 'Resilience, persistence, test of faith, boundaries', reversed: 'Stubbornness, defensiveness, giving up', category: 'wands', number: 9 },
  { name: 'Ten of Wands', image: '/cards/Wands10.png', upright: 'Burden, responsibility, hard work, completion', reversed: 'Release, delegation, taking on too much', category: 'wands', number: 10 },
  { name: 'Page of Wands', image: '/cards/Wands11.png', upright: 'Exploration, discovery, free spirit, enthusiasm', reversed: 'Lack of direction, procrastination, no motivation', category: 'wands', number: 11 },
  { name: 'Knight of Wands', image: '/cards/Wands12.png', upright: 'Action, adventure, impulsiveness, free spirit', reversed: 'Haste, scattered energy, delays, frustration', category: 'wands', number: 12 },
  { name: 'Queen of Wands', image: '/cards/Wands13.png', upright: 'Courage, confidence, independence, determination', reversed: 'Selfishness, jealousy, lack of confidence', category: 'wands', number: 13 },
  { name: 'King of Wands', image: '/cards/Wands14.png', upright: 'Natural-born leader, vision, entrepreneur, honor', reversed: 'Impulsiveness, haste, ruthless, poor leadership', category: 'wands', number: 14 },
]

// Minor Arcana - Cups (Water - Emotions, Relationships, Intuition)
const cupsCards: TarotCard[] = [
  { name: 'Ace of Cups', image: '/cards/Cups01.png', upright: 'New feelings, compassion, spirituality, intuition', reversed: 'Emotional loss, blocked creativity, emptiness', category: 'cups', number: 1 },
  { name: 'Two of Cups', image: '/cards/Cups02.png', upright: 'Unified love, partnership, mutual attraction, connection', reversed: 'Breakdown in communication, imbalance, tension', category: 'cups', number: 2 },
  { name: 'Three of Cups', image: '/cards/Cups03.png', upright: 'Friendship, community, gatherings, celebrations', reversed: 'Isolation, exclusion, third-party problems', category: 'cups', number: 3 },
  { name: 'Four of Cups', image: '/cards/Cups04.png', upright: 'Apathy, contemplation, disconnectedness, re-evaluation', reversed: 'Clarity, acceptance, choosing happiness', category: 'cups', number: 4 },
  { name: 'Five of Cups', image: '/cards/Cups05.png', upright: 'Loss, grief, disappointment, sadness, regret', reversed: 'Acceptance, moving on, finding peace', category: 'cups', number: 5 },
  { name: 'Six of Cups', image: '/cards/Cups06.png', upright: 'Revisiting the past, childhood memories, innocence', reversed: 'Living in the past, moving forward, leaving home', category: 'cups', number: 6 },
  { name: 'Seven of Cups', image: '/cards/Cups07.png', upright: 'Choices, illusions, wishful thinking, opportunities', reversed: 'Lack of purpose, confusion, disarray', category: 'cups', number: 7 },
  { name: 'Eight of Cups', image: '/cards/Cups08.png', upright: 'Walking away, abandonment, leaving behind, seeking deeper meaning', reversed: 'Avoidance, fear of abandonment, stagnation', category: 'cups', number: 8 },
  { name: 'Nine of Cups', image: '/cards/Cups09.png', upright: 'Contentment, satisfaction, emotional fulfillment, wish come true', reversed: 'Lack of inner joy, dissatisfaction, unhappiness', category: 'cups', number: 9 },
  { name: 'Ten of Cups', image: '/cards/Cups10.png', upright: 'Divine love, alignment, harmony, alignment, blissful relationships', reversed: 'Disconnection, misaligned values, broken home', category: 'cups', number: 10 },
  { name: 'Page of Cups', image: '/cards/Cups11.png', upright: 'New feelings, creativity, intuitive messages, curiosity', reversed: 'Emotional immaturity, creative blocks, insecurity', category: 'cups', number: 11 },
  { name: 'Knight of Cups', image: '/cards/Cups12.png', upright: 'Romance, charm, imagination, following the heart', reversed: 'Moodiness, disappointment, unrealistic expectations', category: 'cups', number: 12 },
  { name: 'Queen of Cups', image: '/cards/Cups13.png', upright: 'Compassion, emotional security, calm, intuitive', reversed: 'Inner feelings, self-compassion, co-dependency', category: 'cups', number: 13 },
  { name: 'King of Cups', image: '/cards/Cups14.png', upright: 'Emotional balance, compassion, diplomacy, control', reversed: 'Emotional manipulation, moodiness, emotional abuse', category: 'cups', number: 14 },
]

// Minor Arcana - Swords (Air - Intellect, Communication, Conflict)
const swordsCards: TarotCard[] = [
  { name: 'Ace of Swords', image: '/cards/Swords01.png', upright: 'Breakthrough, new ideas, mental clarity, success', reversed: 'Confusion, clouded judgment, lack of clarity', category: 'swords', number: 1 },
  { name: 'Two of Swords', image: '/cards/Swords02.png', upright: 'Difficult choices, indecision, stalemate, stuck', reversed: 'Indecision, lesser of two evils, no right choice', category: 'swords', number: 2 },
  { name: 'Three of Swords', image: '/cards/Swords03.png', upright: 'Heartbreak, emotional pain, sorrow, grief', reversed: 'Recovery, forgiveness, moving on, healing', category: 'swords', number: 3 },
  { name: 'Four of Swords', image: '/cards/Swords04.png', upright: 'Rest, restoration, contemplation, recuperation', reversed: 'Restlessness, burnout, stress, lack of progress', category: 'swords', number: 4 },
  { name: 'Five of Swords', image: '/cards/Swords05.png', upright: 'Conflict, disagreements, competition, defeat', reversed: 'Reconciliation, making amends, past resentment', category: 'swords', number: 5 },
  { name: 'Six of Swords', image: '/cards/Swords06.png', upright: 'Transition, change, moving on, leaving behind', reversed: 'Stuck in past, resistance to change, carrying baggage', category: 'swords', number: 6 },
  { name: 'Seven of Swords', image: '/cards/Swords07.png', upright: 'Deception, trickery, tactics, strategy, lies', reversed: 'Coming clean, rethinking approach, deception', category: 'swords', number: 7 },
  { name: 'Eight of Swords', image: '/cards/Swords08.png', upright: 'Imprisonment, self-victimization, restriction, powerlessness', reversed: 'Self-acceptance, new perspective, freedom', category: 'swords', number: 8 },
  { name: 'Nine of Swords', image: '/cards/Swords09.png', upright: 'Anxiety, worry, fear, depression, nightmares', reversed: 'Hope, reaching out, despair, mental torture', category: 'swords', number: 9 },
  { name: 'Ten of Swords', image: '/cards/Swords10.png', upright: 'Betrayal, backstabbing, endings, loss, crisis', reversed: 'Recovery, regeneration, resisting an end', category: 'swords', number: 10 },
  { name: 'Page of Swords', image: '/cards/Swords11.png', upright: 'New ideas, curiosity, thirst for knowledge, communication', reversed: 'All talk, no action, haste, scattered thoughts', category: 'swords', number: 11 },
  { name: 'Knight of Swords', image: '/cards/Swords12.png', upright: 'Action, impulsiveness, defending beliefs, aggression', reversed: 'No direction, disregard for consequences, unpredictability', category: 'swords', number: 12 },
  { name: 'Queen of Swords', image: '/cards/Swords13.png', upright: 'Clear boundaries, direct communication, independence', reversed: 'Cold hearted, cruel, bitterness, harsh truth', category: 'swords', number: 13 },
  { name: 'King of Swords', image: '/cards/Swords14.png', upright: 'Mental clarity, intellectual power, authority, truth', reversed: 'Manipulation, cruelty, abuse of power, cold-hearted', category: 'swords', number: 14 },
]

// Minor Arcana - Pentacles (Earth - Material, Work, Money)
const pentaclesCards: TarotCard[] = [
  { name: 'Ace of Pentacles', image: '/cards/Pentacles01.png', upright: 'New opportunities, resources, abundance, prosperity', reversed: 'Lost opportunity, lack of planning, bad investment', category: 'pentacles', number: 1 },
  { name: 'Two of Pentacles', image: '/cards/Pentacles02.png', upright: 'Balance, priorities, time management, juggling', reversed: 'Imbalance, unorganized, overwhelmed, priorities', category: 'pentacles', number: 2 },
  { name: 'Three of Pentacles', image: '/cards/Pentacles03.png', upright: 'Teamwork, collaboration, learning, building', reversed: 'Lack of teamwork, disorganized, group conflict', category: 'pentacles', number: 3 },
  { name: 'Four of Pentacles', image: '/cards/Pentacles04.png', upright: 'Control, stability, security, possessiveness', reversed: 'Greed, materialism, self-protection, insecurity', category: 'pentacles', number: 4 },
  { name: 'Five of Pentacles', image: '/cards/Pentacles05.png', upright: 'Need, poverty, insecurity, isolation, worry', reversed: 'Recovery, charity, poverty, isolation', category: 'pentacles', number: 5 },
  { name: 'Six of Pentacles', image: '/cards/Pentacles06.png', upright: 'Giving, receiving, sharing wealth, generosity', reversed: 'Strings attached, stinginess, power and domination', category: 'pentacles', number: 6 },
  { name: 'Seven of Pentacles', image: '/cards/Pentacles07.png', upright: 'Hard work, perseverance, diligence, long-term view', reversed: 'Lack of growth, shortcuts, no reward, work without results', category: 'pentacles', number: 7 },
  { name: 'Eight of Pentacles', image: '/cards/Pentacles08.png', upright: 'Skill, quality, mastery, attention to detail', reversed: 'Lack of quality, no motivation, mediocrity', category: 'pentacles', number: 8 },
  { name: 'Nine of Pentacles', image: '/cards/Pentacles09.png', upright: 'Abundance, luxury, self-sufficiency, financial independence', reversed: 'Self-worth, overindulgence, reckless spending, financial independence', category: 'pentacles', number: 9 },
  { name: 'Ten of Pentacles', image: '/cards/Pentacles10.png', upright: 'Wealth, inheritance, family, long-term success, contribution', reversed: 'Financial failure, lack of stability, family disputes', category: 'pentacles', number: 10 },
  { name: 'Page of Pentacles', image: '/cards/Pentacles11.png', upright: 'Ambition, desire, diligence, new opportunities', reversed: 'Lack of commitment, laziness, procrastination', category: 'pentacles', number: 11 },
  { name: 'Knight of Pentacles', image: '/cards/Pentacles12.png', upright: 'Efficiency, routine, conservatism, responsibility', reversed: 'Laziness, boredom, feeling stuck, no growth', category: 'pentacles', number: 12 },
  { name: 'Queen of Pentacles', image: '/cards/Pentacles13.png', upright: 'Practical, nurturing, security, down-to-earth', reversed: 'Self-centeredness, workaholic, financially irresponsible', category: 'pentacles', number: 13 },
  { name: 'King of Pentacles', image: '/cards/Pentacles14.png', upright: 'Abundance, prosperity, security, leadership, achievement', reversed: 'Financial failure, stubborn, chauvinistic, lack of discipline', category: 'pentacles', number: 14 },
]

// Combine all cards
export const allCards: TarotCard[] = [
  ...majorArcana,
  ...wandsCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards,
]

// Card combination interpretations
export function getCombinationMeaning(cards: Array<{ card: TarotCard; isReversed: boolean; position: string }>): string {
  const [past, present, future] = cards
  
  // Check for specific card combinations
  const cardNames = cards.map(c => c.card.name)
  const reversedCount = cards.filter(c => c.isReversed).length
  
  // Major Arcana combinations
  if (cardNames.includes('Death') && cardNames.includes('The Tower')) {
    return 'A powerful transformation is occurring. The past shows sudden upheaval (Death/Tower), but this destruction leads to rebirth. Embrace the change.'
  }
  
  if (cardNames.includes('The Sun') && cardNames.includes('The Star')) {
    return 'A beautiful journey of hope and joy. Your past struggles (Star) are leading to present success (Sun), with a bright future ahead.'
  }
  
  if (cardNames.includes('The Fool') && cardNames.includes('The World')) {
    return 'A complete cycle. You began with innocence and new beginnings (Fool), and are reaching completion (World). This is a full journey.'
  }
  
  // Element combinations
  const elements = cards.map(c => {
    if (c.card.category === 'wands') return 'fire'
    if (c.card.category === 'cups') return 'water'
    if (c.card.category === 'swords') return 'air'
    if (c.card.category === 'pentacles') return 'earth'
    return 'major'
  })
  
  if (elements.filter(e => e === 'fire').length >= 2) {
    return 'Fire energy dominates - passion, action, and creativity are driving forces. Be mindful of impulsiveness.'
  }
  
  if (elements.filter(e => e === 'water').length >= 2) {
    return 'Emotional waters run deep. Focus on relationships, intuition, and emotional healing.'
  }
  
  if (elements.filter(e => e === 'air').length >= 2) {
    return 'Mental energy and communication are key. Be aware of potential conflicts or the need for clear communication.'
  }
  
  if (elements.filter(e => e === 'earth').length >= 2) {
    return 'Material and practical matters are prominent. Focus on work, finances, and building stability.'
  }
  
  // Reversed card patterns
  if (reversedCount === 3) {
    return 'All cards reversed suggests internal work is needed. The answers lie within - focus on self-reflection and inner transformation.'
  }
  
  if (reversedCount === 0) {
    return 'All cards upright indicate clear, direct energy. The path forward is straightforward - trust your instincts.'
  }
  
  // Position-based interpretations
  if (past.isReversed && !present.isReversed && !future.isReversed) {
    return 'You are releasing past patterns and moving forward with clarity. The past no longer holds you back.'
  }
  
  if (!past.isReversed && present.isReversed && future.isReversed) {
    return 'You are in a period of transition. The present may feel unclear, but the future requires inner work and reflection.'
  }
  
  // Default combination reading
  return `Your reading shows a journey from ${past.isReversed ? 'releasing' : 'building upon'} past experiences, through a ${present.isReversed ? 'challenging' : 'clear'} present moment, toward a future that ${future.isReversed ? 'requires inner reflection' : 'holds promise'}. Consider how these cards relate to your question and trust your intuition.`
}

