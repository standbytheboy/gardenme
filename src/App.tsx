import './App.css'
import './components/accordion/Accordion.tsx'
import { Accordion } from './components/accordion/Accordion.tsx'

interface AccordionItemData {
  header: string;
  content: string;
}

function App() {
  const accordionData: AccordionItemData[] = [
    { header: "What is TypeScript?", content: "TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript." },
    { header: "Why use TypeScript?", content: "TypeScript helps catch errors early, improves code readability, and provides better tooling." },
    { header: "How to install?", content: "You can install TypeScript globally using npm: `npm install -g typescript`." },
  ];
  return (
    <>
      <h1>GardenMe</h1>
      <div>
      <Accordion items={accordionData} /> {/* Pass the 'items' prop here */}
    </div>
    </>
  )
}

export default App

