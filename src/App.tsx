import Header from './components/Header';
import Footer from './components/SydneySender/Footer';
import './App.css'
import { SydneySender } from './components/SydneySender/SydneySender';
import MoaeButton from './components/MoaeButton';

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Barlow, sans-serif",
        backgroundColor: "#1A1A1A",
      }}
    >
      <MoaeButton />
      <Header />
      <div style={{ flex: "1", alignSelf: "center", width: "100%", height: "100%"}}>
        <SydneySender />
      </div>
      <Footer />
    </div>
  )
}

export default App
