'use server'

import axios from 'axios'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function searchGoogle(query: string) {
  const response = await axios.get(
    'https://www.googleapis.com/customsearch/v1',
    {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
      },
    },
  )
  return response.data.items
    .slice(0, 3)
    .map((item: any) => item.snippet)
    .join('\n')
}

async function processWithAI(searchResults: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes search results.',
      },
      {
        role: 'user',
        content: `Podsumuj podany niżej wynik wyszukiwania, SearchResults:\n\n${searchResults}`,
      },
    ],
  })

  return completion.choices[0].message.content
}

async function processDiscountTicketWithAI(searchResults: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes search results.',
      },
      {
        role: 'user',
        content: `Podsumuj podany niżej wynik wyszukiwania, następnie zwróć jedynie cenę biletu ulgowego, SearchResults:\n\n${searchResults}`,
      },
    ],
  })

  return completion.choices[0].message.content
}

async function processStandardTicketWithAI(searchResults: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes search results.',
      },
      {
        role: 'user',
        content: `Podsumuj podany niżej wynik wyszukiwania, następnie zwróć jedynie cenę biletu normalnego, SearchResults:\n\n${searchResults}`,
      },
    ],
  })

  return completion.choices[0].message.content
}

export async function performSearch(placeName: string) {
  try {
    const searchResults = await searchGoogle(`cena biletu ${placeName}`)

    const processedResults = await processWithAI(searchResults)
    return { results: processedResults }
  } catch (error) {
    console.error('Error processing search:', error)
    return { error: 'An error occurred while processing your search' }
  }
}

export async function performDiscountTicketSearch(placeName: string) {
  try {
    const searchResults = await searchGoogle(`cena biletu ${placeName}`)
    const processedResults = await processDiscountTicketWithAI(searchResults)
    return { results: processedResults }
  } catch (error) {
    console.error('Error processing search:', error)
    return { error: 'An error occurred while processing your search' }
  }
}

export async function performStandardTicketSearch(placeName: string) {
  try {
    const searchResults = await searchGoogle(`cena biletu ${placeName}`)

    const processedResults = await processStandardTicketWithAI(searchResults)
    return { results: processedResults }
  } catch (error) {
    console.error('Error processing search:', error)
    return { error: 'An error occurred while processing your search' }
  }
}
