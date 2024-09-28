import {
  performDiscountTicketSearch,
  performStandardTicketSearch,
} from '@/services/search.services'

export default async function Home() {
  const { results } = await performDiscountTicketSearch('Zamek Krzysztopór')

  return <>{results}</>
}
