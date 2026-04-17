import { useEffect, useState } from 'react'

type InspectionRiskLevel = 'baixo' | 'medio' | 'alto'

type Pendencia = {
  id: string
  company_id: string
  inspection_id: string | null
  problem_description: string
  sector: string
  risk_level: InspectionRiskLevel
  responsible: string
  due_date: string | null
  status: string
  created_at: string
  updated_at: string
}

export function PendenciasPage() {
  const [pendencias, setPendencias] = useState<Pendencia[]>([])

  useEffect(() => {
    setPendencias([
      {
        id: '1',
        company_id: '1',
        inspection_id: null,
        problem_description: 'Fiação exposta',
        sector: 'Produção',
        risk_level: 'alto',
        responsible: 'João',
        due_date: null,
        status: 'aberta',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Pendências</h1>

      {pendencias.map((pendencia) => (
        <div key={pendencia.id}>
          <h3>{pendencia.problem_description}</h3>
          <p>{pendencia.sector}</p>
        </div>
      ))}
    </div>
  )
}