import { useEffect, useState, type FormEvent } from 'react'
import { searchAddresses, type AddressSuggestion } from './addressLookup'

type UseAddressSearchOptions = {
  latitude: number
  longitude: number
  searchEnabled: boolean
  onSelect: (result: AddressSuggestion) => void
}

/** Manages address autocomplete state for the solar planner. */
export function useAddressSearch({ latitude, longitude, searchEnabled, onSelect }: UseAddressSearchOptions) {
  const [addressQuery, setAddressQuery] = useState('')
  const [addressResults, setAddressResults] = useState<AddressSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    if (!searchEnabled || !isSearchFocused || addressQuery.trim().length < 3) {
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true)
        setAddressResults(await searchAddresses(addressQuery.trim(), latitude, longitude, controller.signal))
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setAddressResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 250)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [addressQuery, isSearchFocused, latitude, longitude, searchEnabled])

  const selectAddress = (result: AddressSuggestion) => {
    setAddressQuery(result.label)
    setAddressResults([])
    setIsSearchFocused(false)
    onSelect(result)
  }

  const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (addressResults[0]) {
      selectAddress(addressResults[0])
    }
  }

  const handleAddressChange = (value: string) => {
    setAddressQuery(value)
    if (value.trim().length < 3) {
      setAddressResults([])
      setIsSearching(false)
    }
  }

  const resetSearch = () => {
    setAddressQuery('')
    setAddressResults([])
    setIsSearching(false)
    setIsSearchFocused(false)
  }

  return {
    addressQuery,
    addressResults,
    isSearching,
    isSearchFocused,
    handleAddressSubmit,
    handleAddressChange,
    handleSearchBlur: () => setIsSearchFocused(false),
    handleSearchFocus: () => setIsSearchFocused(true),
    resetSearch,
    selectAddress,
  }
}
