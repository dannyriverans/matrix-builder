"use client";
import React from "react";

// Configuration data
const yAxes = [
  { code: "E1", label: "E1" },
  { code: "E2", label: "E2" },
  { code: "E3", label: "E3" },
  { code: "E4", label: "E4" },
];

const xAxes = [
  { code: "C1", label: "C1" },
  { code: "C2", label: "C2" },
  { code: "C3", label: "C3" },
];

const zAxes = [
  { code: "S1", label: "S1" },
  { code: "S2", label: "S2" },
  { code: "S3", label: "S3" },
];

const colors = ["red", "orange", "yellow", "green", "blue", "gray"];

export default function Matrix() {
  const [matrixPosition, setMatrixPosition] = React.useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [matrixValues, setMatrixValues] = React.useState(
    zAxes.map(() =>
      yAxes.map(() =>
        xAxes.map(() => ({
          value: 0,
          color: "gray",
          label: "-",
        }))
      )
    )
  );

  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    value: "",
    label: "",
    color: "",
  });

  const handleCellClick = (z: number, x: number, y: number) => {
    setMatrixPosition({ x, y, z });
    setFormData({
      value: matrixValues[z][x][y].value.toString(),
      label: matrixValues[z][x][y].label,
      color: matrixValues[z][x][y].color,
    });
    setShowModal(true);
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const updatedMatrixValues = matrixValues.map((section, z) =>
      section.map((row, x) =>
        row.map((cell, y) =>
          z === matrixPosition.z &&
          x === matrixPosition.x &&
          y === matrixPosition.y
            ? {
                color: formData.color,
                label: formData.label,
                value: parseInt(formData.value),
              }
            : cell
        )
      )
    );

    setMatrixValues(updatedMatrixValues);
    setShowModal(false);
  };

  return (
    <>
      <h1 className="text-center font-bold text-3xl">
        3D Matrix Representation
      </h1>
      <div
        className={`w-full px-8 grid gap-1 mt-8`}
        style={{
          gridTemplateColumns: `auto repeat(${xAxes.length}, 1fr)`,
        }}
      >
        {/* X-axis Headers */}
        <div></div>
        {xAxes.map(({ label }) => (
          <div key={label} className="p-2 font-bold text-center">
            {label}
          </div>
        ))}

        {/* Z-axis and Y-axis Labels with Matrix Cells */}
        {zAxes.map((zAxis, z) => (
          <React.Fragment key={zAxis.code}>
            <div
              className="p-2 font-bold text-center bg-gray-200 col-span-full text-black"
              style={{ gridColumn: `span ${xAxes.length + 1}` }}
            >
              {zAxis.label}
            </div>
            {yAxes.map((yAxis, y) => (
              <React.Fragment key={`${z}.${y}`}>
                <div className="p-2 font-bold text-center">{yAxis.label}</div>
                {xAxes.map((xAxis, x) => (
                  <div
                    key={`${z}.${y}.${x}`}
                    className={`p-4 text-white rounded-md bg-${matrixValues[z][y][x].color}-800 text-center cursor-pointer`}
                    onClick={() => handleCellClick(z, y, x)}
                  >
                    {matrixValues[z][y][x].label}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Print Matrix Button */}
      <div className="w-full flex my-8 px-8">
        <button
          onClick={() => console.log(JSON.stringify(matrixValues))}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 ml-auto"
        >
          Print Matrix
        </button>
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
              Edit Cell ({zAxes[matrixPosition.z].label} -{" "}
              {yAxes[matrixPosition.x].label} - {xAxes[matrixPosition.y].label})
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a color</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
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
    </>
  );
}
