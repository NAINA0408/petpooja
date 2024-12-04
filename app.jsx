import React, { useState, useMemo } from "react";
import "./App.css"; // Add your styles here

// Reusable Custom Table Component
const CustomTable = ({ data, columns, styles }) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [filters, setFilters] = useState({});

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter(row => {
      return Object.keys(filters).every(key => {
        const value = String(row[key] || "").toLowerCase();
        const filterValue = filters[key]?.toLowerCase() || "";
        return value.includes(filterValue);
      });
    });
  }, [sortedData, filters]);

  const handleSort = key => {
    let direction = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig?.key === key && sortConfig.direction === "descending") {
      direction = null;
    }
    setSortConfig(direction ? { key, direction } : null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="table-container" style={styles?.container}>
      <table>
        <thead style={styles?.header}>
          <tr>
            {columns.map(column => (
              <th key={column.key}>
                <div className="header-cell">
                  <span>{column.title}</span>
                  {column.sortable && (
                    <button onClick={() => handleSort(column.key)}>
                      {sortConfig?.key === column.key
                        ? sortConfig.direction === "ascending"
                          ? "▲"
                          : "▼"
                        : "⇵"}
                    </button>
                  )}
                  {column.filterable && (
                    <input
                      type="text"
                      placeholder={`Filter ${column.title}`}
                      onChange={e => handleFilterChange(column.key, e.target.value)}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={styles?.body}>
          {filteredData.map((row, idx) => (
            <tr key={idx}>
              {columns.map(column => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Reusable Custom Form Component
const InputField = ({ field, value, onChange }) => {
  const handleChange = e => onChange(field.key, e.target.value);

  switch (field.type) {
    case "text":
      return (
        <div>
          <label>{field.label}</label>
          <input
            type="text"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={handleChange}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          <label>{field.label}</label>
          <textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={handleChange}
          />
        </div>
      );
    case "select":
      return (
        <div>
          <label>{field.label}</label>
          <select value={value || ""} onChange={handleChange}>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    default:
      return null;
  }
};

const FormSystem = ({ config, onSubmit }) => {
  const [formData, setFormData] = useState(() =>
    config.reduce((acc, field) => {
      acc[field.key] = field.defaultValue || "";
      return acc;
    }, {})
  );

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {config.map(field => (
        <InputField
          key={field.key}
          field={field}
          value={formData[field.key]}
          onChange={handleChange}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

// Reusable Custom Date Picker Component
const DatePicker = ({ onSelect }) => {
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  const handlePresetClick = preset => {
    const now = new Date();
    let range;
    if (preset === "Today") range = { from: now, to: now };
    if (preset === "Yesterday") range = { from: new Date(now - 864e5), to: new Date(now - 864e5) };
    onSelect(range);
  };

  const handleCustomRangeChange = e => {
    setCustomRange({ ...customRange, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <button onClick={() => handlePresetClick("Today")}>Today</button>
      <button onClick={() => handlePresetClick("Yesterday")}>Yesterday</button>
      <div>
        <input
          type="date"
          name="from"
          value={customRange.from}
          onChange={handleCustomRangeChange}
        />
        <input
          type="date"
          name="to"
          value={customRange.to}
          onChange={handleCustomRangeChange}
        />
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const tableData = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 20 },
  ];

  const tableColumns = [
    { key: "id", title: "ID", sortable: true, filterable: true },
    { key: "name", title: "Name", sortable: true, filterable: true },
    { key: "age", title: "Age", sortable: true, filterable: false },
  ];

  const formConfig = [
    { key: "name", type: "text", label: "Name", placeholder: "Enter your name" },
    {
      key: "feedback",
      type: "textarea",
      label: "Feedback",
      placeholder: "Enter your feedback",
    },
    {
      key: "rating",
      type: "select",
      label: "Rating",
      options: [1, 2, 3, 4, 5],
    },
  ];

  return (
    <div className="App">
      <h1>Custom Table</h1>
      <CustomTable data={tableData} columns={tableColumns} />

      <h1>Custom Form</h1>
      <FormSystem
        config={formConfig}
        onSubmit={data => console.log("Form Submitted:", data)}
      />

      <h1>Custom Date Picker</h1>
      <DatePicker onSelect={range => console.log("Date Selected:", range)} />
    </div>
  );
};

export default App;
