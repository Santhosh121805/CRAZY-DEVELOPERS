const hre = require("hardhat");

async function main() {
  const ethers = hre.ethers;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Stablecoin = await ethers.getContractFactory("MockStablecoin");
  const stablecoin = await Stablecoin.deploy();
  await stablecoin.waitForDeployment();
  console.log("✅ Stablecoin deployed at:", await stablecoin.getAddress());

  const FamilyFi = await ethers.getContractFactory("FamilyFi");
  const familyFi = await FamilyFi.deploy(
    await stablecoin.getAddress(),
    deployer.address
  );
  await familyFi.waitForDeployment();
  console.log("✅ FamilyFi deployed at:", await familyFi.getAddress());

  const tx = await stablecoin.transfer(
    await familyFi.getAddress(),
    ethers.parseUnits("10000", 18)
  );
  await tx.wait();
  console.log("✅ Funded FamilyFi with 10,000 stablecoins");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
