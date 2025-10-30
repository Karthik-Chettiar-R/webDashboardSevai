import fs from 'fs'
import path from 'path'
import type { GetStaticProps } from 'next'
import { PieChartWithLegend } from '@/components/ui/pie-chart-with-legend'
import { MonthlyHeatmap } from '@/components/ui/monthly-heatmap'
import { SampleDataTable } from '@/components/ui/sample-data-table'
import { Card } from '@/components/ui/card'
import {InteractiveHoverButton} from '@/components/ui/interactive-hover-button'

type User = {
  id: string
  name: string
  email: string
  joined: string
}

export default function Home({ users }: { users: User[] }) {
  return (
    
     
      <div className="p-8 space-y-8">
        <PieChartWithLegend />
        
        <SampleDataTable />
        <InteractiveHoverButton/>
       
        <MonthlyHeatmap 
            width={500} 
            height={300} 
            events={true}
        />
      </div>
        
    
   
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const p = path.join(process.cwd(), 'public', 'sample-users.json')
  const raw = fs.readFileSync(p, 'utf8')
  const users = JSON.parse(raw) as User[]
  return { props: { users } }
}
