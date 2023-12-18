import cv, { Mat } from "@u4/opencv4nodejs";

const mat = cv.imread("./samples/Scan.tiff");

const createMask = (mat: Mat) => {
  // const hsv = mat.cvtColor(cv.COLOR_BGR2RGB);

  // const lowerBlue = new cv.Vec3(100, 50, 50);
  // const upperBlue = new cv.Vec3(140, 255, 255);

  // const blueMask = hsv.inRange(lowerBlue, upperBlue);
  const grey = mat.cvtColor(cv.COLOR_BGR2GRAY);
  const blackAndWhite = grey.threshold(20, 255, cv.THRESH_BINARY);

  // const kernel = cv.Mat.ones(5, 5, cv.CV_8U);

  // let mask = blueMask;
  // for (let i = 0; i < 100; i++) {
  //   mask = mask.dilate(kernel);
  //   mask = mask.erode(kernel);
  // }
  const se2 = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
  const se1 = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));

  // Perform morphological operations - closing then opening
  const result = blackAndWhite.morphologyEx(se2, cv.MORPH_OPEN);
  const mask = result.morphologyEx(se1, cv.MORPH_CLOSE);

  // Filter the output using the mask
  // export const out = blueMask.bitwiseAnd(result);

  return mask;
};

const findCorners = (mask: Mat) => {
  const cornerHarrisOutput = mask.cornerHarris(5, 3, 0.04, 2);
  return cornerHarrisOutput.dilate(
    cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5))
  );
};

const mask = createMask(mat);

// const canny = mask.canny(100, 200);

// // Find all contours
const contours = mask
  .findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
  .map((c) => c.getPoints());

export const corners = findCorners(mask);
console.log(contours)

const result = mat.copy();
// // Draw all contours
result.drawContours(contours, -1, new cv.Vec3(255, 0, 0), { thickness: -1 });

// const test = new cv.Mat(result.getDataAsArray(), cv.CV_8UC3) // new cv.Mat(result.sizes[0], result.sizes[1], cv.CV_8UC3, 1);
cv.imshow("a window name", result);
cv.imshow("a window name 2", corners);
if (cv.waitKey(0)) cv.destroyAllWindows();
