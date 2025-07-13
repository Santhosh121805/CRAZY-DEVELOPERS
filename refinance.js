// POST /api/refinance
app.post('/api/refinance', async (req, res) => {
  const { walletAddress, amount, baseRate } = req.body;

  try {
    const tx = await familyFi.refinanceLoanWithStablecoin(
      ethers.parseUnits(amount, 18),
      baseRate
    );
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Loan refinancing failed" });
  }
});
