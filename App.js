import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Shield, Sword, Wand, Star, Heart, Zap, Feather, Flame, Droplet, Wind, Trash2 } from 'lucide-react';

const KofiButton = () => (
  <a 
    href="https://ko-fi.com/teznaco"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 hover:text-blue-300 transition-colors"
  >
    Buy me a coffee!
  </a>
);

const ITEM_QUALITIES = [
  { name: 'Common', color: 'text-gray-400', bg: 'bg-gray-400' },
  { name: 'Uncommon', color: 'text-green-500', bg: 'bg-green-500' },
  { name: 'Rare', color: 'text-blue-400', bg: 'bg-blue-400' },
  { name: 'Epic', color: 'text-purple-400', bg: 'bg-purple-400' },
  { name: 'Legendary', color: 'text-orange-400', bg: 'bg-orange-400' }
];

const ICONS = [
  { name: 'Shield', component: Shield },
  { name: 'Sword', component: Sword },
  { name: 'Wand', component: Wand },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
  { name: 'Zap', component: Zap },
  { name: 'Feather', component: Feather },
  { name: 'Flame', component: Flame },
  { name: 'Droplet', component: Droplet },
  { name: 'Wind', component: Wind }
];

const STAT_TYPES = [
  'Strength', 'Agility', 'Intellect', 'Stamina', 'Critical Strike', 'Haste', 'Mastery', 'Versatility', 'Custom'
];

const IconDropdown = ({ selectedIcon, onSelectIcon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">Icon</label>
    <div className="relative">
      <select 
        className="appearance-none bg-gray-800 p-2 pr-8 rounded w-full"
        value={selectedIcon}
        onChange={(e) => onSelectIcon(Number(e.target.value))}
      >
        {ICONS.map((icon, index) => (
          <option key={index} value={index}>
            {icon.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        {React.createElement(ICONS[selectedIcon].component, { size: 20 })}
      </div>
    </div>
  </div>
);

const WoWTooltip = React.forwardRef(({ itemName, itemLevel, quality, stats, effects, description, icon: IconComponent }, ref) => (
  <div ref={ref} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm border border-gray-700 inline-block">
    <h2 className={`${ITEM_QUALITIES[quality].color} font-bold text-lg flex items-center mb-2`}>
      {React.createElement(IconComponent, { className: "mr-2 text-yellow-500", size: 20 })}
      {itemName || 'Unnamed Item'}
    </h2>
    <p className="text-yellow-400 mb-1">Item Level {itemLevel || 1}</p>
    <p className="text-gray-400 mb-3">Binds when picked up</p>
    <div className="mb-3">
      {stats.map((stat, index) => (
        <p key={index} className="text-green-400">{`+${stat.value} ${stat.type}`}</p>
      ))}
    </div>
    {effects.map((effect, index) => (
      <p key={index} className={`${effect.type === 'Use' ? 'text-blue-200' : 'text-yellow-200'} mb-1`}>
        {effect.type}: {effect.description}
      </p>
    ))}
    <p className="italic text-gray-500 mb-3">{description || 'No description'}</p>
  </div>
));

const App = () => {
  const [itemName, setItemName] = useState('');
  const [itemLevel, setItemLevel] = useState('');
  const [quality, setQuality] = useState(0);
  const [stats, setStats] = useState([{ type: STAT_TYPES[0], value: '', custom: '' }]);
  const [effects, setEffects] = useState([{ type: 'Equip', description: '' }]);
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(0);
  const tooltipRef = useRef(null);

  const handleStatChange = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const addStat = () => setStats([...stats, { type: STAT_TYPES[0], value: '', custom: '' }]);

  const removeStat = (index) => {
    const newStats = stats.filter((_, i) => i !== index);
    setStats(newStats);
  };

  const handleEffectChange = (index, field, value) => {
    const newEffects = [...effects];
    newEffects[index][field] = value;
    setEffects(newEffects);
  };

  const addEffect = () => setEffects([...effects, { type: 'Equip', description: '' }]);

  const removeEffect = (index) => {
    const newEffects = effects.filter((_, i) => i !== index);
    setEffects(newEffects);
  };

  const handleDownload = () => {
    if (tooltipRef.current) {
      html2canvas(tooltipRef.current).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'wow-tooltip.png';
        link.click();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative flex flex-col">
      <h1 className="text-3xl font-bold mb-8 text-center">WoW Tooltip Customizer</h1>
      <div className="flex justify-center space-x-8 flex-grow">
        <div className="w-full max-w-xl space-y-4">
          <input
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Item Level"
            type="number"
            value={itemLevel}
            onChange={(e) => setItemLevel(e.target.value)}
          />
          <select
            className="w-full bg-gray-800 p-2 rounded"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          >
            {ITEM_QUALITIES.map((q, index) => (
              <option key={index} value={index} className={q.color}>
                {q.name}
              </option>
            ))}
          </select>
          {stats.map((stat, index) => (
            <div key={index} className="flex space-x-2">
              <select
                className="w-1/3 bg-gray-800 p-2 rounded"
                value={stat.type}
                onChange={(e) => handleStatChange(index, 'type', e.target.value)}
              >
                {STAT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {stat.type === 'Custom' ? (
                <input
                  className="w-1/3 bg-gray-800 p-2 rounded"
                  placeholder="Custom Stat"
                  value={stat.custom}
                  onChange={(e) => handleStatChange(index, 'custom', e.target.value)}
                />
              ) : null}
              <input
                className="w-1/3 bg-gray-800 p-2 rounded"
                placeholder="Value"
                type="number"
                value={stat.value}
                onChange={(e) => handleStatChange(index, 'value', e.target.value)}
              />
              <button
                className="bg-red-500 p-2 rounded hover:bg-red-600 transition"
                onClick={() => removeStat(index)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600 transition"
            onClick={addStat}
          >
            Add Stat
          </button>
          {effects.map((effect, index) => (
            <div key={index} className="space-y-2">
              <div className="flex space-x-2">
                <select
                  className="w-full bg-gray-800 p-2 rounded"
                  value={effect.type}
                  onChange={(e) => handleEffectChange(index, 'type', e.target.value)}
                >
                  <option value="Equip">Equip</option>
                  <option value="Use">Use</option>
                </select>
                <button
                  className="bg-red-500 p-2 rounded hover:bg-red-600 transition"
                  onClick={() => removeEffect(index)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <input
                className="w-full bg-gray-800 p-2 rounded"
                placeholder={`What happens when you ${effect.type.toLowerCase()} this item?`}
                value={effect.description}
                onChange={(e) => handleEffectChange(index, 'description', e.target.value)}
              />
            </div>
          ))}
          <button
            className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600 transition"
            onClick={addEffect}
          >
            Add Effect
          </button>
          <textarea
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Item Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <IconDropdown selectedIcon={selectedIcon} onSelectIcon={setSelectedIcon} />
          <button
            className="w-full bg-green-500 p-2 rounded hover:bg-green-600 transition"
            onClick={handleDownload}
          >
            Download Tooltip
          </button>
        </div>
        <div className="flex-shrink-0">
          <WoWTooltip
            ref={tooltipRef}
            itemName={itemName}
            itemLevel={itemLevel}
            quality={quality}
            stats={stats.filter(stat => stat.value !== '').map(stat => ({
              ...stat,
              type: stat.type === 'Custom' ? stat.custom : stat.type
            }))}
            effects={effects.filter(effect => effect.description !== '')}
            description={description}
            icon={ICONS[selectedIcon].component}
          />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <KofiButton />
      </div>
    </div>
  );
};

export default App;
