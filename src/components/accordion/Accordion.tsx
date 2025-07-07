import { useRef, useState } from "react";
import type { FC } from "react";
import { ChevronDown } from "akar-icons";

// Define the shape of a single accordion item
interface AccordionItemData{ 
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
    <li className="list-none m-0 p-0"> {}
      <h2
        className={`
          flex items-center gap-5 h-12 px-2.5 pl-5 rounded-lg cursor-pointer
          mb-2.5 text-[#A7C957] text-base font-bold transition-all duration-300
          opacity-70
          ${isActive ? "opacity-100" : ""}
          hover:bg-[#A7C95750] hover:opacity-100
        `}
        onClick={() => handleToggle(index)}
      >
        {header}
        <ChevronDown
          strokeWidth={4}
          size={20}
          className={`transition-transform duration-300 ease-in-out ${isActive ? "rotate-180" : ""}`}
        />
      </h2>
      <div
        ref={contentEl}
        className="relative h-0 overflow-hidden transition-all duration-500 ease-in-out"
        style={
          isActive
            ? { height: contentEl.current?.scrollHeight || 0 }
            : { height: 0 }
        }
      >
        <p className="px-5 pb-2.5 leading-relaxed text-sm m-0 opacity-65 cursor-pointer">
          {content}
        </p>
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
    <ul className="list-none m-0 p-0"> {/* .accordion */}
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