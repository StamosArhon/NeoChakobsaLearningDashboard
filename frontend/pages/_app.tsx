import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <Sidebar />
      <main className="p-4">
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
