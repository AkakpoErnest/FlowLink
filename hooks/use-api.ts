import { useState, useEffect } from 'react'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  total?: number
  limit?: number
  offset?: number
}

export interface ApiError {
  message: string
  status?: number
}

export function useApi<T>(
  endpoint: string,
  options: RequestInit = {},
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        })

        const result: ApiResponse<T> = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'API request failed')
        }

        if (result.success) {
          setData(result.data || null)
        } else {
          throw new Error(result.error || 'API request failed')
        }
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Unknown error occurred',
          status: err instanceof Error && 'status' in err ? (err as any).status : undefined
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  const refetch = () => {
    setLoading(true)
    setError(null)
    // Trigger useEffect by updating a dependency
    setData(null)
  }

  return { data, loading, error, refetch }
}

// Specific hooks for different data types
export function usePaymentLinks(status?: string, merchantId?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (merchantId) params.append('merchantId', merchantId)
  
  const endpoint = `/api/payment-links${params.toString() ? `?${params.toString()}` : ''}`
  
  return useApi(endpoint, {}, [status, merchantId])
}

export function usePayments(linkId?: string, status?: string, limit = 50, offset = 0) {
  const params = new URLSearchParams()
  if (linkId) params.append('linkId', linkId)
  if (status) params.append('status', status)
  params.append('limit', limit.toString())
  params.append('offset', offset.toString())
  
  const endpoint = `/api/payments?${params.toString()}`
  
  return useApi(endpoint, {}, [linkId, status, limit, offset])
}

export function useVaults(status?: string, includePolicies = false) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (includePolicies) params.append('includePolicies', 'true')
  
  const endpoint = `/api/vaults${params.toString() ? `?${params.toString()}` : ''}`
  
  return useApi(endpoint, {}, [status, includePolicies])
}

export function usePayrollBatches(status?: string, includeRecipients = false) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (includeRecipients) params.append('includeRecipients', 'true')
  
  const endpoint = `/api/payroll${params.toString() ? `?${params.toString()}` : ''}`
  
  return useApi(endpoint, {}, [status, includeRecipients])
}

export function useRWASubscriptions(status?: string, type?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (type) params.append('type', type)
  
  const endpoint = `/api/rwa${params.toString() ? `?${params.toString()}` : ''}`
  
  return useApi(endpoint, {}, [status, type])
}

export function useRWAProducts(type?: string) {
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  
  const endpoint = `/api/rwa/products${params.toString() ? `?${params.toString()}` : ''}`
  
  return useApi(endpoint, {}, [type])
}

// Mutation hooks for creating/updating data
export function useCreatePaymentLink() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const createLink = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment link')
      }

      return result.data
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createLink, loading, error }
}

export function useCreateVault() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const createVault = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/vaults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create vault')
      }

      return result.data
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createVault, loading, error }
}

export function useCreatePayrollBatch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const createBatch = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payroll batch')
      }

      return result.data
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createBatch, loading, error }
}

export function useCreateRWASubscription() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const createSubscription = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/rwa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create RWA subscription')
      }

      return result.data
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createSubscription, loading, error }
}
