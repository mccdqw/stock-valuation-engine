import { useState } from "react";
import { BASE_FIELDS, STRATEGIES } from "../utils/strategies";

export default function StrategyFormWrapper({ onSubmit }) {
  const [selected, setSelected] = useState("ma_crossover");
  const [formValues, setFormValues] = useState(() => {
    const init = {};
    [...BASE_FIELDS, ...STRATEGIES[0].fields].forEach((f) => {
      init[f.name] = f.default || "";
    });
    init.custom_file = null;
    return init;
  });

  const strategy = STRATEGIES.find((s) => s.id === selected);

  const handleChange = (name, value, files) => {
    if (name === "file") {
      setFormValues((prev) => ({ ...prev, custom_file: files?.[0] || null }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStrategyChange = (e) => {
    const newId = e.target.value;
    setSelected(newId);
    const newStrategy = STRATEGIES.find((s) => s.id === newId);
    setFormValues((prev) => {
      const reset = { ...prev };
      newStrategy.fields.forEach((f) => {
        reset[f.name] = f.default || "";
      });
      return reset;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();

    // Base params
    const params = {
      symbol: formValues.symbol,
      start_date: formValues.startDate,
      end_date: formValues.endDate,
      initial_capital: parseFloat(formValues.initialCapital),
      strategy: {
        type: selected,
        ...strategy.fields.reduce((acc, f) => {
          acc[f.name] = isNaN(Number(formValues[f.name]))
            ? formValues[f.name]
            : Number(formValues[f.name]);
          return acc;
        }, {}),
      },
    };

    submitData.append("params", JSON.stringify(params));

    if (formValues.custom_file) {
      submitData.append("file", formValues.custom_file);
    }

    await onSubmit(submitData);
  };

  return (
    <div>
      {/* Strategy Selector */}
      <label className="block mb-2 font-medium">Choose Strategy</label>
      <select
        value={selected}
        onChange={handleStrategyChange}
        className="border p-2 rounded w-full mb-4"
      >
        {STRATEGIES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Unified Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {BASE_FIELDS.map((field) => (
          <div key={field.name}>
            <label className="block mb-1">{field.label}</label>
            <input
              type={field.type}
              value={field.type === "file" ? undefined : formValues[field.name]}
              onChange={(e) =>
                handleChange(field.name, e.target.value, e.target.files)
              }
              className="border p-2 rounded w-full"
              {...(field.type === "file" ? { accept: ".csv" } : {})}
            />
          </div>
        ))}

        {strategy.fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-1">{field.label}</label>
            <input
              type={field.type}
              value={formValues[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Run Backtest
        </button>
      </form>
    </div>
  );
}
