import React, { useState, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import cn from 'classnames'

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
  debounceMs?: number
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '搜索...',
  onSearch,
  className,
  debounceMs = 300,
}) => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const debouncedSearch = useDebounce(onSearch, debounceMs)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    debouncedSearch(newValue)
  }, [debouncedSearch])

  const handleClear = useCallback(() => {
    setValue('')
    onSearch('')
  }, [onSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setValue('')
      onSearch('')
      e.currentTarget.blur()
    }
  }, [onSearch])

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center border border-color border-radius transition-normal',
          isFocused ? 'border-accent-blue shadow-md' : 'hover:border-hover'
        )}
      >
        <span className="pl-md text-muted">🔍</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none px-md py-2 text-primary placeholder-text-muted"
        />
        {value && (
          <button
            onClick={handleClear}
            className="px-md text-muted hover:text-primary transition-normal"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchInput