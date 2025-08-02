import StatCard from '../components/StatCard'

export default function Dashboard() {
  const stats = [
    { number: '2,847', label: 'Total Words' },
    { number: '156', label: 'Grammar Rules' },
    { number: '89', label: 'Phonology Entries' },
    { number: '12', label: 'Last Scraped (hours ago)' },
  ]
  return (
    <div>
      <h2 className="text-center text-4xl mb-10">Dashboard</h2>
      <div className="dashboard-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} number={s.number} label={s.label} />
        ))}
      </div>
    </div>
  )
}
