import { sql, isDatabaseConnected } from './database'

export type Vocabulary = {
  id: string
  word: string
  definition: string
  example?: string
  difficulty?: string
  created_at: string
}

export type VideoDrill = {
  id: string
  title: string
  description: string
  video_url: string
  tags?: string
  created_at: string
}

// Local storage keys (fallback)
const VOCABULARY_KEY = 'vsscs_vocabulary'
const VIDEO_DRILLS_KEY = 'vsscs_video_drills'

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Basic volleyball vocabulary data - 50 essential terms
const basicVolleyballVocab: Omit<Vocabulary, 'id' | 'created_at'>[] = [
  {
    word: "Spike",
    definition: "A powerful downward attack hit by a player jumping above the net",
    example: "The outside hitter delivered a crushing spike that won the point",
    difficulty: "easy"
  },
  {
    word: "Serve",
    definition: "The action of putting the ball into play by hitting it over the net to start a rally",
    example: "She practiced her serve until she could consistently hit the target area",
    difficulty: "easy"
  },
  {
    word: "Bump",
    definition: "A basic pass using both forearms together to contact the ball, also called a forearm pass",
    example: "The libero made a perfect bump to set up the attack",
    difficulty: "easy"
  },
  {
    word: "Set",
    definition: "A precise pass that positions the ball for an attacker to spike",
    example: "The setter delivered a quick set to the middle hitter",
    difficulty: "easy"
  },
  {
    word: "Block",
    definition: "A defensive play where players jump with arms extended to stop an attack at the net",
    example: "The middle blocker timed the block perfectly to stuff the spike",
    difficulty: "easy"
  },
  {
    word: "Dig",
    definition: "A defensive move to keep the ball alive after an attack, usually close to the ground",
    example: "The libero made an amazing dig to save the point",
    difficulty: "easy"
  },
  {
    word: "Ace",
    definition: "A serve that results in a direct point without the receiving team touching the ball",
    example: "Her jump serve was an ace that landed right on the line",
    difficulty: "easy"
  },
  {
    word: "Kill",
    definition: "An attack that results in an immediate point or side-out",
    example: "The outside hitter recorded 15 kills in the match",
    difficulty: "easy"
  },
  {
    word: "Rotation",
    definition: "The clockwise movement of players to new positions after winning a side-out",
    example: "After the rotation, she moved from middle back to right back position",
    difficulty: "easy"
  },
  {
    word: "Side-out",
    definition: "When the receiving team wins a rally and gains the right to serve",
    example: "They needed a side-out to get the serve back and score points",
    difficulty: "easy"
  },
  {
    word: "Rally",
    definition: "The sequence of play from the serve until the ball hits the ground or goes out of bounds",
    example: "It was an exciting 20-hit rally that had the crowd on their feet",
    difficulty: "easy"
  },
  {
    word: "Net",
    definition: "The barrier that divides the court, standing 7 feet 11⅝ inches high for women and 8 feet for men",
    example: "The ball barely cleared the net for a successful attack",
    difficulty: "easy"
  },
  {
    word: "Court",
    definition: "The playing area measuring 18 meters long by 9 meters wide, divided by a net",
    example: "Players must stay within the court boundaries during play",
    difficulty: "easy"
  },
  {
    word: "Libero",
    definition: "A specialized defensive player who wears a different colored jersey and cannot attack above net height",
    example: "The libero is the best passer on the team and plays only in the back row",
    difficulty: "easy"
  },
  {
    word: "Attack Line",
    definition: "The line 3 meters from the net that separates front row from back row players",
    example: "Back row players must jump from behind the attack line when spiking",
    difficulty: "easy"
  },
  {
    word: "Pass",
    definition: "The first contact with the ball after it crosses the net, used to control and direct the ball",
    example: "A good pass is essential for setting up a successful attack",
    difficulty: "easy"
  },
  {
    word: "Setter",
    definition: "The player responsible for setting up attacks by delivering precise passes to hitters",
    example: "The setter is like the quarterback of the volleyball team",
    difficulty: "easy"
  },
  {
    word: "Hitter",
    definition: "A player who attacks the ball, also called an attacker or spiker",
    example: "The outside hitter is usually the team's primary scoring threat",
    difficulty: "easy"
  },
  {
    word: "Front Row",
    definition: "The three players positioned closest to the net who can attack and block",
    example: "Front row players rotate clockwise after each side-out",
    difficulty: "easy"
  },
  {
    word: "Back Row",
    definition: "The three players positioned away from the net who focus on defense and passing",
    example: "Back row players cannot attack the ball above net height from in front of the attack line",
    difficulty: "easy"
  },
  {
    word: "Overhand Serve",
    definition: "A serve hit with an overhead motion, similar to throwing a ball",
    example: "The overhand serve allows for more power and accuracy than an underhand serve",
    difficulty: "easy"
  },
  {
    word: "Underhand Serve",
    definition: "A serve hit with an underhand motion, often used by beginners",
    example: "She started with an underhand serve before learning the overhand technique",
    difficulty: "easy"
  },
  {
    word: "Float Serve",
    definition: "A serve with no spin that moves unpredictably through the air",
    example: "The float serve is difficult to pass because of its erratic movement",
    difficulty: "easy"
  },
  {
    word: "Jump Serve",
    definition: "A serve where the player jumps and hits the ball at the peak of their jump",
    example: "His jump serve was so powerful it was almost impossible to return",
    difficulty: "easy"
  },
  {
    word: "Service Line",
    definition: "The back boundary line from which players must serve",
    example: "Players must stay behind the service line when serving",
    difficulty: "easy"
  },
  {
    word: "Antenna",
    definition: "The flexible rods attached to the net that mark the sideline boundaries",
    example: "The ball hit the antenna and was ruled out of bounds",
    difficulty: "easy"
  },
  {
    word: "Centerline",
    definition: "The line directly under the net that divides the court into two equal halves",
    example: "Players cannot step completely over the centerline during play",
    difficulty: "easy"
  },
  {
    word: "Sideline",
    definition: "The boundary lines that run along the long sides of the court",
    example: "The ball landed just inside the sideline for a point",
    difficulty: "easy"
  },
  {
    word: "Baseline",
    definition: "The boundary lines at the back of the court, also called the service line",
    example: "She served from behind the baseline to start the rally",
    difficulty: "easy"
  },
  {
    word: "Double Hit",
    definition: "An illegal play where one player contacts the ball twice in succession",
    example: "The referee called a double hit when the setter touched the ball twice",
    difficulty: "easy"
  },
  {
    word: "Carry",
    definition: "An illegal play where the ball is held or thrown rather than cleanly hit",
    example: "The setter was called for a carry on the set",
    difficulty: "easy"
  },
  {
    word: "Net Violation",
    definition: "An illegal play where a player touches the net during play",
    example: "The middle blocker was called for a net violation after touching the net",
    difficulty: "easy"
  },
  {
    word: "Foot Fault",
    definition: "An illegal serve where the server steps on or over the service line",
    example: "The server was called for a foot fault on her jump serve",
    difficulty: "easy"
  },
  {
    word: "Out of Bounds",
    definition: "When the ball lands outside the court boundaries",
    example: "The spike went out of bounds, giving the point to the other team",
    difficulty: "easy"
  },
  {
    word: "In Bounds",
    definition: "When the ball lands within the court boundaries",
    example: "The ball was ruled in bounds after hitting the line",
    difficulty: "easy"
  },
  {
    word: "Touch",
    definition: "When a player makes contact with the ball, often used to describe deflections",
    example: "The blocker got a touch on the ball, slowing it down for the defense",
    difficulty: "easy"
  },
  {
    word: "Stuff Block",
    definition: "A block that immediately sends the ball back to the attacker's side for a point",
    example: "The middle blocker got a stuff block that ended the rally",
    difficulty: "easy"
  },
  {
    word: "Pancake",
    definition: "A defensive technique where a player slides their hand flat on the floor to dig the ball",
    example: "She made an incredible pancake dig to keep the ball alive",
    difficulty: "easy"
  },
  {
    word: "Shank",
    definition: "A bad pass that goes far off target, usually off the arms or hands",
    example: "The serve was so hard it caused a shank that went into the stands",
    difficulty: "easy"
  },
  {
    word: "Dink",
    definition: "A soft attack that barely clears the net, used to catch defenders off guard",
    example: "Instead of spiking hard, she used a dink to score the point",
    difficulty: "easy"
  },
  {
    word: "Tip",
    definition: "A soft attack using fingertips to redirect the ball over or around the block",
    example: "The outside hitter used a tip to place the ball in the open court",
    difficulty: "easy"
  },
  {
    word: "Approach",
    definition: "The steps a hitter takes before jumping to attack the ball",
    example: "Her four-step approach gave her maximum height for the spike",
    difficulty: "easy"
  },
  {
    word: "Transition",
    definition: "The movement from defense to offense or from one skill to another",
    example: "The team's quick transition from defense to attack caught their opponents off guard",
    difficulty: "easy"
  },
  {
    word: "Platform",
    definition: "The flat surface created by joining both forearms together for passing",
    example: "Keep your platform steady when passing the ball",
    difficulty: "easy"
  },
  {
    word: "Ready Position",
    definition: "The basic stance players use to prepare for the next play",
    example: "All players should be in ready position before the serve",
    difficulty: "easy"
  },
  {
    word: "Communication",
    definition: "Verbal and non-verbal signals players use to coordinate during play",
    example: "Good communication is essential for successful team play",
    difficulty: "easy"
  },
  {
    word: "Timeout",
    definition: "A break in play called by a team to discuss strategy or stop momentum",
    example: "The coach called a timeout to settle the team down",
    difficulty: "easy"
  },
  {
    word: "Substitution",
    definition: "Replacing one player with another during the match",
    example: "The coach made a substitution to bring in a fresh hitter",
    difficulty: "easy"
  },
  {
    word: "Match Point",
    definition: "The point that, if won, will end the match",
    example: "They were down match point but managed to come back and win",
    difficulty: "easy"
  },
  {
    word: "Game Point",
    definition: "The point that, if won, will end the current set",
    example: "She served an ace on game point to win the set",
    difficulty: "easy"
  },
  {
    word: "Deuce",
    definition: "When both teams are tied at 24-24 in a set, requiring a two-point margin to win",
    example: "The set went to deuce before they finally won 26-24",
    difficulty: "easy"
  }
]

// Local storage fallback functions
const getLocalVocabulary = (): Vocabulary[] => {
  try {
    const stored = localStorage.getItem(VOCABULARY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const getLocalVideodrills = (): VideoDrill[] => {
  try {
    const stored = localStorage.getItem(VIDEO_DRILLS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Initialize basic vocabulary if none exists
const initializeBasicVocabulary = async (): Promise<void> => {
  const existing = await getVocabulary()
  
  // Only add basic vocab if no vocabulary exists yet
  if (existing.length === 0) {
    console.log('🏐 Adding 50 basic volleyball vocabulary terms...')
    
    for (const vocab of basicVolleyballVocab) {
      await addVocabulary(vocab)
    }
    
    console.log('✅ 50 basic volleyball vocabulary terms added successfully!')
  }
}

// Vocabulary functions
export const getVocabulary = async (): Promise<Vocabulary[]> => {
  if (!isDatabaseConnected() || !sql) {
    return getLocalVocabulary()
  }

  try {
    const result = await sql`
      SELECT * FROM vocabulary 
      ORDER BY created_at DESC
    `
    return result.map(row => ({
      id: row.id,
      word: row.word,
      definition: row.definition,
      example: row.example || undefined,
      difficulty: row.difficulty || 'medium',
      created_at: row.created_at
    }))
  } catch (error) {
    console.error('Error fetching vocabulary from database:', error)
    return getLocalVocabulary()
  }
}

export const addVocabulary = async (vocab: Omit<Vocabulary, 'id' | 'created_at'>): Promise<Vocabulary> => {
  const newVocab: Vocabulary = {
    ...vocab,
    id: generateId(),
    created_at: new Date().toISOString()
  }

  if (!isDatabaseConnected() || !sql) {
    // Fallback to local storage
    const existing = getLocalVocabulary()
    const updated = [newVocab, ...existing]
    localStorage.setItem(VOCABULARY_KEY, JSON.stringify(updated))
    return newVocab
  }

  try {
    await sql`
      INSERT INTO vocabulary (id, word, definition, example, difficulty, created_at)
      VALUES (${newVocab.id}, ${newVocab.word}, ${newVocab.definition}, ${newVocab.example || null}, ${newVocab.difficulty}, ${newVocab.created_at})
    `
    return newVocab
  } catch (error) {
    console.error('Error adding vocabulary to database:', error)
    // Fallback to local storage
    const existing = getLocalVocabulary()
    const updated = [newVocab, ...existing]
    localStorage.setItem(VOCABULARY_KEY, JSON.stringify(updated))
    return newVocab
  }
}

export const updateVocabulary = async (id: string, updates: Partial<Omit<Vocabulary, 'id' | 'created_at'>>): Promise<void> => {
  if (!isDatabaseConnected() || !sql) {
    // Fallback to local storage
    const existing = getLocalVocabulary()
    const updated = existing.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    localStorage.setItem(VOCABULARY_KEY, JSON.stringify(updated))
    return
  }

  try {
    // Build the SET clause dynamically
    const updateFields = []
    const values: any = { id }
    
    if (updates.word !== undefined) {
      updateFields.push('word = $word')
      values.word = updates.word
    }
    if (updates.definition !== undefined) {
      updateFields.push('definition = $definition')
      values.definition = updates.definition
    }
    if (updates.example !== undefined) {
      updateFields.push('example = $example')
      values.example = updates.example || null
    }
    if (updates.difficulty !== undefined) {
      updateFields.push('difficulty = $difficulty')
      values.difficulty = updates.difficulty
    }
    
    if (updateFields.length > 0) {
      const query = `UPDATE vocabulary SET ${updateFields.join(', ')} WHERE id = $id`
      await sql(query, values)
    }
  } catch (error) {
    console.error('Error updating vocabulary in database:', error)
    // Fallback to local storage
    const existing = getLocalVocabulary()
    const updated = existing.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    localStorage.setItem(VOCABULARY_KEY, JSON.stringify(updated))
  }
}

export const deleteVocabulary = async (id: string): Promise<void> => {
  if (!isDatabaseConnected() || !sql) {
    // Fallback to local storage
    const existing = getLocalVocabulary()
    const filtered = existing.filter(item => item.id !== id)
    localStorage.setItem(VOCABULARY_KEY, JSON.stringify(filtered))
    return
  }

  try {
    await sql`DELETE FROM vocabulary WHERE id = ${id}`
  } catch (error) {
    console.error('Error deleting vocabulary from database:', error)
    // Fallback to local storage
    const existing = getLocalVocabulary()
    const filtered = existing.filter(item => item.id !== id)
    localStorage.setItem(VOCABULARY_KEY, JSON.stringify(filtered))
  }
}

// Video drill functions
export const getVideodrills = async (): Promise<VideoDrill[]> => {
  if (!isDatabaseConnected() || !sql) {
    return getLocalVideodrills()
  }

  try {
    const result = await sql`
      SELECT * FROM video_drills 
      ORDER BY created_at DESC
    `
    return result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      video_url: row.video_url,
      tags: row.tags || undefined,
      created_at: row.created_at
    }))
  } catch (error) {
    console.error('Error fetching videos from database:', error)
    return getLocalVideodrills()
  }
}

export const addVideoDrill = async (video: Omit<VideoDrill, 'id' | 'created_at'>): Promise<VideoDrill> => {
  const newVideo: VideoDrill = {
    ...video,
    id: generateId(),
    created_at: new Date().toISOString()
  }

  if (!isDatabaseConnected() || !sql) {
    // Fallback to local storage
    const existing = getLocalVideodrills()
    const updated = [newVideo, ...existing]
    localStorage.setItem(VIDEO_DRILLS_KEY, JSON.stringify(updated))
    return newVideo
  }

  try {
    await sql`
      INSERT INTO video_drills (id, title, description, video_url, tags, created_at)
      VALUES (${newVideo.id}, ${newVideo.title}, ${newVideo.description}, ${newVideo.video_url}, ${newVideo.tags || null}, ${newVideo.created_at})
    `
    return newVideo
  } catch (error) {
    console.error('Error adding video to database:', error)
    // Fallback to local storage
    const existing = getLocalVideodrills()
    const updated = [newVideo, ...existing]
    localStorage.setItem(VIDEO_DRILLS_KEY, JSON.stringify(updated))
    return newVideo
  }
}

export const updateVideoDrill = async (id: string, updates: Partial<Omit<VideoDrill, 'id' | 'created_at'>>): Promise<void> => {
  if (!isDatabaseConnected() || !sql) {
    // Fallback to local storage
    const existing = getLocalVideodrills()
    const updated = existing.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    localStorage.setItem(VIDEO_DRILLS_KEY, JSON.stringify(updated))
    return
  }

  try {
    // Build the SET clause dynamically
    const updateFields = []
    const values: any = { id }
    
    if (updates.title !== undefined) {
      updateFields.push('title = $title')
      values.title = updates.title
    }
    if (updates.description !== undefined) {
      updateFields.push('description = $description')
      values.description = updates.description
    }
    if (updates.video_url !== undefined) {
      updateFields.push('video_url = $video_url')
      values.video_url = updates.video_url
    }
    if (updates.tags !== undefined) {
      updateFields.push('tags = $tags')
      values.tags = updates.tags || null
    }
    
    if (updateFields.length > 0) {
      const query = `UPDATE video_drills SET ${updateFields.join(', ')} WHERE id = $id`
      await sql(query, values)
    }
  } catch (error) {
    console.error('Error updating video drill in database:', error)
    // Fallback to local storage
    const existing = getLocalVideodrills()
    const updated = existing.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    localStorage.setItem(VIDEO_DRILLS_KEY, JSON.stringify(updated))
  }
}

export const deleteVideoDrill = async (id: string): Promise<void> => {
  if (!isDatabaseConnected() || !sql) {
    // Fallback to local storage
    const existing = getLocalVideodrills()
    const filtered = existing.filter(item => item.id !== id)
    localStorage.setItem(VIDEO_DRILLS_KEY, JSON.stringify(filtered))
    return
  }

  try {
    await sql`DELETE FROM video_drills WHERE id = ${id}`
  } catch (error) {
    console.error('Error deleting video from database:', error)
    // Fallback to local storage
    const existing = getLocalVideodrills()
    const filtered = existing.filter(item => item.id !== id)
    localStorage.setItem(VIDEO_DRILLS_KEY, JSON.stringify(filtered))
  }
}

// Export the initialization function
export { initializeBasicVocabulary }