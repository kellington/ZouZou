import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CRITTERS, CRITTER_LABEL, type Critter } from '../lib/critters';
import { CritterIcon } from './Icons';

interface CritterPickerProps {
  value: Critter;
  onChange: (critter: Critter) => void;
}

export function CritterPicker({ value, onChange }: CritterPickerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        id="critter-picker-label"
        className="text-xs font-black uppercase tracking-wider text-[#4A3B32]/55"
      >
        Find:
      </span>
      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={(next) => onChange(next as Critter)}
        aria-labelledby="critter-picker-label"
        className="flex items-center gap-2"
      >
        {CRITTERS.map((critter) => (
          <RadioGroupPrimitive.Item
            key={critter}
            value={critter}
            aria-label={CRITTER_LABEL[critter]}
            title={CRITTER_LABEL[critter]}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#4A3B32]/15 bg-white text-[#4A3B32]/40 outline-none transition-colors hover:border-[#4A3B32]/40 focus-visible:ring-2 focus-visible:ring-[#D97736] focus-visible:ring-offset-2 data-[state=checked]:border-[#4A3B32] data-[state=checked]:bg-[#4A3B32]/10 data-[state=checked]:text-[#4A3B32]"
          >
            <CritterIcon critter={critter} className="h-7 w-7" aria-hidden="true" />
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
      <span
        aria-hidden="true"
        className="block h-4 text-center text-xs font-black uppercase tracking-wider text-[#4A3B32]/55"
      >
        {CRITTER_LABEL[value]}
      </span>
    </div>
  );
}
