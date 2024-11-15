/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

// Configuration data
const exposures = [
  { code: "E1", label: "E1" },
  { code: "E2", label: "E2" },
  { code: "E3", label: "E3" },
  { code: "E4", label: "E4" },
];

const controllabilities = [
  { code: "C1", label: "C1" },
  { code: "C2", label: "C2" },
  { code: "C3", label: "C3" },
];

const severities = [
  { code: "S1", label: "S1" },
  { code: "S2", label: "S2" },
  { code: "S3", label: "S3" },
];

const probabilities = [
  {
    code: "A",
    label: "Frequent",
  },
  {
    code: "B",
    label: "Probable",
  },
  {
    code: "C",
    label: "Occasional",
  },
  {
    code: "D",
    label: "Remote",
  },
  {
    code: "E",
    label: "Improbable",
  },
  {
    code: "F",
    label: "Eliminated",
  },
];

const severities2 = [
  {
    code: "1",
    label: "Catastrophic",
  },
  {
    code: "2",
    label: "Critical",
  },
  {
    code: "3",
    label: "Marginal",
  },
  {
    code: "4",
    label: "Negligible",
  },
];

const colors = [
  {
    code: "#D32F2F",
    label: "Red",
  },
  {
    code: "#FF8F00",
    label: "Orange",
  },
  {
    code: "#FFD600",
    label: "Yellow",
  },
  {
    code: "#64DD17",
    label: "Green",
  },
  {
    code: "#1976D2",
    label: "Blue",
  },
  {
    code: "#424242",
    label: "Gray",
  },
];

const catalogs = [
  "None",
  "Severity",
  "Exposure",
  "Controllability",
  "Probability",
  "Severity2",
];

const ActionButton = ({ label, onClick, disabled = false }: any) => (
  <button
    className="text-sm font-medium py-1 px-3 rounded transition-all duration-200 ease-in-out text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

const getCatalogOptions = (catalog: string) => {
  switch (catalog) {
    case "Severity":
      return severities;
    case "Exposure":
      return exposures;
    case "Controllability":
      return controllabilities;
    case "Probability":
      return probabilities;
    case "Severity2":
      return severities2;
    default:
      return [];
  }
};

const MatrixCell = ({ cell, onClick, showRisk }: any) => (
  <div
    role="button"
    style={{ backgroundColor: cell.color }}
    className="py-2 text-black text-center cursor-pointer hover:bg-gray-700 text-xl"
    onClick={onClick}
  >
    {!showRisk ? cell.label : cell.value}
  </div>
);

export default function NewMatrix() {
  const [matrixPosition, setMatrixPosition] = useState({ x: 0, y: 0 });
  const [rowNumber, setRowNumber] = useState(1);
  const [colNumber, setColNumber] = useState(1);
  const [matrix, setMatrix] = useState([
    [
      {
        value: 0,
        color: "#424242",
        label: "-",
      },
    ],
  ]);
  const [showModal, setShowModal] = React.useState(false);
  const [showRiskValue, setShowRiskValue] = React.useState(false);
  const [formData, setFormData] = React.useState({
    value: "",
    label: "",
    color: "",
  });

  const [zAxis, setZAxis] = useState("None");
  const [yAxis, setYAxis] = useState("None");
  const [xAxis, setXAxis] = useState("None");

  const [zAxisValues, setZAxisValues] = useState([{ value: "" }]);
  const [yAxisValues, setYAxisValues] = useState([{ value: "" }]);
  const [xAxisValues, setXAxisValues] = useState([{ value: "" }]);

  const handleCellClick = (x: number, y: number) => {
    setMatrixPosition({ x, y });
    setFormData({
      value: matrix[x][y].value.toString(),
      label: matrix[x][y].label,
      color: matrix[x][y].color,
    });
    setShowModal(true);
  };

  const handleFormInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const updatedMatrix = matrix.map((row, x) =>
      row.map((cell, y) =>
        x === matrixPosition.x && y === matrixPosition.y
          ? {
              color: formData.color,
              label: formData.label,
              value: parseInt(formData.value),
            }
          : cell
      )
    );

    setMatrix(updatedMatrix);
    setShowModal(false);
  };

  useEffect(() => {
    if (rowNumber > matrix.length) {
      setMatrix((prevMatrix) => [
        ...prevMatrix,
        Array.from({ length: colNumber }, () => ({
          value: 0,
          color: "#424242",
          label: "-",
        })),
      ]);
    } else if (rowNumber < matrix.length) {
      setMatrix((prevMatrix) => prevMatrix.slice(0, rowNumber));
    }

    if (colNumber > matrix[0].length) {
      setMatrix((prevMatrix) =>
        prevMatrix.map((row) => [
          ...row,
          {
            value: 0,
            color: "#424242",
            label: "-",
          },
        ])
      );
    } else if (colNumber < matrix[0].length) {
      setMatrix((prevMatrix) =>
        prevMatrix.map((row) => row.slice(0, colNumber))
      );
    }
  }, [rowNumber, colNumber, matrix]);

  const updateAxisValues = (
    axis: string,
    setValues: React.Dispatch<React.SetStateAction<{ value: string }[]>>
  ) => {
    // When a major selector is changed, reset the values of the axis
    const firstOption = getCatalogOptions(axis)[0];
    setValues((prev) => prev.map(() => ({ value: firstOption?.code ?? "" })));
  };

  useEffect(() => updateAxisValues(zAxis, setZAxisValues), [zAxis]);
  useEffect(() => updateAxisValues(yAxis, setYAxisValues), [yAxis]);
  useEffect(() => updateAxisValues(xAxis, setXAxisValues), [xAxis]);

  useEffect(() => {
    // If rowNumbers decrease, remove the last element from the array
    // Otherwise, add a new element with the first option from the catalog
    if (rowNumber < zAxisValues.length) {
      setZAxisValues((prev) => prev.slice(0, rowNumber));
    } else {
      const firstOption = getCatalogOptions(zAxis)[0];
      setZAxisValues((prev) => [...prev, { value: firstOption?.code ?? "" }]);
    }
  }, [rowNumber]);

  useEffect(() => {
    // If rowNumbers decrease, remove the last element from the array
    // Otherwise, add a new element with the first option from the catalog
    if (rowNumber < zAxisValues.length) {
      setYAxisValues((prev) => prev.slice(0, rowNumber));
    } else {
      const firstOption = getCatalogOptions(yAxis)[0];
      setYAxisValues((prev) => [...prev, { value: firstOption?.code ?? "" }]);
    }
  }, [rowNumber]);

  useEffect(() => {
    // If colNumbers decrease, remove the last element from the array
    // Otherwise, add a new element with the first option from the catalog
    if (colNumber < xAxisValues.length) {
      setXAxisValues((prev) => prev.slice(0, colNumber));
    } else {
      const firstOption = getCatalogOptions(xAxis)[0];
      setXAxisValues((prev) => [...prev, { value: firstOption?.code ?? "" }]);
    }
  }, [colNumber]);

  return (
    <div className="p-6 w-full text-gray-300 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl font-semibold mb-4">Safety Matrix</h1>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${colNumber + 2}, 1fr)` }}
      >
        <div className="col-span-1 flex flex-col text-center px-2">
          <span className="my-1">Axis Element:</span>
          <select
            name="zAxis"
            id="zAxis"
            className="p-1 rounded-lg text-black"
            value={zAxis}
            onChange={(e) => setZAxis(e.target.value)}
          >
            {catalogs.map((catalog, index) => (
              <option key={index} value={catalog}>
                {catalog}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1 flex flex-col text-center px-2">
          <span className="my-1">Axis Element:</span>
          <select
            name="yAxis"
            id="yAxis"
            className="p-1 rounded-lg text-black"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
          >
            {catalogs.map((catalog, index) => (
              <option key={index} value={catalog}>
                {catalog}
              </option>
            ))}
          </select>
        </div>
        <div className={`text-center grid col-span-${colNumber}`}>
          <div>
            <span className="mx-2">Axis Element:</span>
            <select
              name="xAxis"
              id="xAxis"
              className="p-1 rounded-lg text-black"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
            >
              {catalogs.map((catalog, index) => (
                <option key={index} value={catalog}>
                  {catalog}
                </option>
              ))}
            </select>
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${colNumber}, 1fr)`,
            }}
          >
            {Array.from({ length: colNumber }, (_, i) => (
              <select
                key={i}
                name="x"
                id={`x-${i}`}
                className="text-black size-full"
                onChange={(e) =>
                  setXAxisValues((prev) =>
                    prev.map((item, index) =>
                      index === i ? { ...item, value: e.target.value } : item
                    )
                  )
                }
              >
                {getCatalogOptions(xAxis).map((option, index) => (
                  <option key={index} value={option.code}>
                    {option.code}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="grid grid-row gap-1">
          {matrix.map((row, x) => (
            <div
              key={`row-${x}`}
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${colNumber + 2}, 1fr)`,
              }}
            >
              <div>
                <select
                  name="z"
                  id={`z-${x}`}
                  className="text-black size-full"
                  onChange={(e) =>
                    setZAxisValues((prev) =>
                      prev.map((item, index) =>
                        index === x ? { ...item, value: e.target.value } : item
                      )
                    )
                  }
                >
                  {getCatalogOptions(zAxis).map((option, index) => (
                    <option key={index} value={option.code}>
                      {option.code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="y"
                  id={`y-${x}`}
                  className="text-black size-full"
                  onChange={(e) =>
                    setYAxisValues((prev) =>
                      prev.map((item, index) =>
                        index === x ? { ...item, value: e.target.value } : item
                      )
                    )
                  }
                >
                  {getCatalogOptions(yAxis).map((option, index) => (
                    <option key={index} value={option.code}>
                      {option.code}
                    </option>
                  ))}
                </select>
              </div>
              {row.map((cell, y) => (
                <MatrixCell
                  key={`${x}-${y}`}
                  cell={cell}
                  onClick={() => handleCellClick(x, y)}
                  showRisk={showRiskValue}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row justify-end py-4">
        <ActionButton
          label="Add Row"
          onClick={() => setRowNumber(rowNumber + 1)}
        />
        <ActionButton
          label="Add Column"
          disabled={colNumber >= 10}
          onClick={() => setColNumber(colNumber + 1)}
        />
        <ActionButton
          label="Remove Row"
          disabled={rowNumber <= 1}
          onClick={() => setRowNumber(rowNumber - 1)}
        />
        <ActionButton
          label="Remove Column"
          disabled={colNumber <= 1}
          onClick={() => setColNumber(colNumber - 1)}
        />
        <ActionButton
          label="Show Risk Value"
          onClick={() => setShowRiskValue(!showRiskValue)}
        />
        <ActionButton
          label="Print Matrix"
          onClick={() => console.log(JSON.stringify(matrix))}
        />
      </div>

      {/* Modal for Editing Cell Values */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="w-full max-w-md p-6 bg-white rounded-md shadow-md"
            role="document"
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Edit{" "}
              {`${zAxisValues[matrixPosition.x]?.value ?? ""} ${
                yAxisValues[matrixPosition.x]?.value ?? ""
              } ${xAxisValues[matrixPosition.y]?.value ?? ""}`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cell Value
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleFormInputChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Risk Hierarchy
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleFormInputChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleFormInputChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a color</option>
                  {colors.map((color) => (
                    <option key={color.label} value={color.code}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
