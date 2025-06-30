import { useRef, useState } from "react";
import type { FC } from "react";
import "./Accordion.css";
import { ChevronDown } from "akar-icons";


// Define the shape of a single accordion item
interface AccordionItemData {
  header: string;
  content: string;
}

// Define the props for the AccordionItem component
interface AccordionItemProps {
  handleToggle: (index: number) => void;
  active: number | null;
  item: AccordionItemData;
  index: number;
}

const AccordionItem: FC<AccordionItemProps> = ({ handleToggle, active, item, index }) => {
  const contentEl = useRef<HTMLDivElement>(null);
  const { header, content } = item;

  // Determine if this item is active
  const isActive = active === index;

  return (
    <li className="accordion-item">
      <h2
        className={isActive ? "active" : ""}
        onClick={() => handleToggle(index)}
      >
        {header}
        {/* Add a class for rotation based on active state */}
        <ChevronDown 
          strokeWidth={2} 
          size={20} 
          className={`chevron-icon ${isActive ? "rotate" : ""}`} 
        />
      </h2>
      <div
        ref={contentEl}
        className="accordion-content"
        style={
          isActive
            ? { height: contentEl.current?.scrollHeight || 0 }
            : { height: 0 }
        }
      >
        <p>{content}</p>
      </div>
    </li>
  );
};

// Define the props for the Accordion component
interface AccordionProps {
  items: AccordionItemData[];
}

export const Accordion: FC<AccordionProps> = ({ items }) => {
  const [active, setActive] = useState<number | null>(null);

  const handleToggle = (index: number) => setActive(active === index ? null : index);

  return (
    <ul className="accordion">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          index={index}
          active={active}
          handleToggle={handleToggle}
          item={item}
        />
      ))}
    </ul>
  );
};