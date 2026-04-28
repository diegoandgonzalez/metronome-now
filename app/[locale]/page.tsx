'use client'
import dynamic from 'next/dynamic'
const Metronome = dynamic(() => import('@/components/metronome'), {
    ssr: false,
})

const Home = () => {

    return (
        <Metronome />
    );
}

export default Home;