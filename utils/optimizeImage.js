// const sharp = require("sharp");
// const path = require("path");

// const MAX_SIZE = 1 * 1024 * 1024; // 1 MB

// const optimizeImage = async (inputPath) => {
//   const extension = path.extname(inputPath).toLowerCase();

//   const outputPath = inputPath.replace(
//     extension,
//     "-optimized.webp"
//   );

//   let quality = 80;

//   // First attempt
//   await sharp(inputPath)
//     .rotate()
//     .resize({
//       width: 1600,
//       height: 1600,
//       fit: "inside",
//       withoutEnlargement: true,
//     })
//     .webp({
//       quality,
//     })
//     .toFile(outputPath);

//   // If still larger than 1 MB,
//   // reduce quality gradually
//   while (true) {
//     const stats = await require("fs").promises.stat(outputPath);

//     if (stats.size <= MAX_SIZE) {
//       break;
//     }

//     quality -= 10;

//     if (quality < 30) {
//       break;
//     }

//     await sharp(inputPath)
//       .rotate()
//       .resize({
//         width: 1600,
//         height: 1600,
//         fit: "inside",
//         withoutEnlargement: true,
//       })
//       .webp({
//         quality,
//       })
//       .toFile(outputPath);
//   }

//   const finalStats = await require("fs").promises.stat(outputPath);

//   if (finalStats.size > MAX_SIZE) {
//     throw new Error("Could not optimize image below 1 MB");
//   }

//   return outputPath;
// };

// module.exports = optimizeImage;