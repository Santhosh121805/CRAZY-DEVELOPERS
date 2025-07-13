// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FamilyFi is Ownable, ReentrancyGuard {
    IERC20 public stablecoin;
    address public oracle;

    struct UserProfile {
        uint256 totalBudget;
        uint256 totalSpent;
        uint256 loanBalance;
        uint256 interestRate;
        uint256 savingsGoal;
        uint256 savingsBalance;
        bool isActive;
    }

    mapping(address => UserProfile) public userProfiles;

    event BudgetSet(address indexed user, uint256 budget);
    event TransactionRecorded(address indexed user, uint256 amount);
    event LoanRefinanced(address indexed user, uint256 amount, uint256 interestRate);
    event SavingsGoalSet(address indexed user, uint256 goal);
    event SavingsDeposited(address indexed user, uint256 amount);
    event SavingsWithdrawn(address indexed user, uint256 amount);

    constructor(address _stablecoin, address _oracle) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
        oracle = _oracle;
    }

    modifier onlyActiveUser() {
        require(userProfiles[msg.sender].isActive, "Profile not active");
        _;
    }

    function initializeProfile() external {
        require(!userProfiles[msg.sender].isActive, "Already initialized");
        userProfiles[msg.sender] = UserProfile(0, 0, 0, 0, 0, 0, true);
    }

    function setBudget(uint256 _budget) external onlyActiveUser {
        userProfiles[msg.sender].totalBudget = _budget;
        emit BudgetSet(msg.sender, _budget);
    }

    function recordTransaction(address _user, uint256 _amount) external {
        require(msg.sender == oracle, "Only oracle can record");
        require(userProfiles[_user].isActive, "Inactive profile");
        userProfiles[_user].totalSpent += _amount;
        emit TransactionRecorded(_user, _amount);
    }

    function refinanceLoanWithStablecoin(uint256 _loanAmount, uint256 _baseInterestRate) external onlyActiveUser nonReentrant {
        require(_loanAmount > 0, "Loan must be > 0");
        require(stablecoin.balanceOf(address(this)) >= _loanAmount, "Insufficient contract balance");

        uint256 discountRate = _baseInterestRate / 2; // e.g., 50% discount

        userProfiles[msg.sender].loanBalance += _loanAmount;
        userProfiles[msg.sender].interestRate = discountRate;

        require(stablecoin.transfer(msg.sender, _loanAmount), "Stablecoin transfer failed");

        emit LoanRefinanced(msg.sender, _loanAmount, discountRate);
    }

    function setSavingsGoal(uint256 _goal) external onlyActiveUser {
        userProfiles[msg.sender].savingsGoal = _goal;
        emit SavingsGoalSet(msg.sender, _goal);
    }

    function depositSavings(uint256 _amount) external onlyActiveUser nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(stablecoin.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        userProfiles[msg.sender].savingsBalance += _amount;
        emit SavingsDeposited(msg.sender, _amount);
    }

    function withdrawSavings(uint256 _amount) external onlyActiveUser nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(userProfiles[msg.sender].savingsBalance >= _amount, "Not enough balance");
        require(stablecoin.transfer(msg.sender, _amount), "Transfer failed");

        userProfiles[msg.sender].savingsBalance -= _amount;
        emit SavingsWithdrawn(msg.sender, _amount);
    }

    function getFinancialSummary(address _user) external view returns (
        uint256 totalBudget,
        uint256 totalSpent,
        uint256 loanBalance,
        uint256 interestRate,
        uint256 savingsGoal,
        uint256 savingsBalance
    ) {
        UserProfile memory profile = userProfiles[_user];
        return (
            profile.totalBudget,
            profile.totalSpent,
            profile.loanBalance,
            profile.interestRate,
            profile.savingsGoal,
            profile.savingsBalance
        );
    }

    function updateOracle(address _newOracle) external onlyOwner {
        oracle = _newOracle;
    }

    function emergencyWithdraw(uint256 _amount) external onlyOwner nonReentrant {
        require(stablecoin.transfer(owner(), _amount), "Transfer failed");
    }
}
