const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Calling initializeProfile for:", deployer.address);

  const familyFiAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // e.g., 0xe7f1... from deploy output
  const FamilyFi = await hre.ethers.getContractFactory("FamilyFi");
  const familyFi = await FamilyFi.attach(familyFiAddress);

  const tx = await familyFi.initializeProfile();
  await tx.wait();

  console.log("✅ initializeProfile() transaction sent:", tx.hash);
}

main().catch((error) => {
  console.error("❌ Initialization failed:", error);
  process.exit(1);
});
