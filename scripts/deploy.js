async function main() {
  const Assessment = await ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(100);

  await assessment.deployed();

  console.log("Assessment deployed to:", assessment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

