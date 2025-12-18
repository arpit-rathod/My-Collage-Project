export const firstLetterUpperCase = (str) => {
  if (!str || typeof str != "string") {
    return "Null";
  }
  return str.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export function extractDetails(data) {
  const departments = Object.keys(data);
  const branchesSet = new Set();
  const yearsSet = new Set();
  const degreesSet = new Set();

  departments.forEach(dept => {
    const degrees = Object.keys(data[dept]);
    degrees.forEach(degree => {
      degreesSet.add(degree);
      const degreeData = data[dept][degree];

      // Collect branches if available
      if (degreeData.branches) {
        degreeData.branches.forEach(branch => branchesSet.add(branch));
      }

      // Collect requiredYear if available
      if (degreeData.requiredYear) {
        degreeData.requiredYear.forEach(year => yearsSet.add(year));
      }
    });
  });

  return {
    departments,
    branches: Array.from(branchesSet),
    degrees: Array.from(degreesSet),
    requiredYears: Array.from(yearsSet)
  };
}
