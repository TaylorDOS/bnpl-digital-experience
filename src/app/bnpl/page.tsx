'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Purchase {
    name: string;
    fullPrice: number;
    bnplPrice: number;
    weekly: number;
    weeks: number;
    noBNPL?: boolean; // <-- Optional flag
}

const purchases: Purchase[] = [
    { name: 'Shoes', fullPrice: 200, bnplPrice: 200, weekly: 50, weeks: 4 },
    { name: 'iPhone', fullPrice: 1000, bnplPrice: 1000, weekly: 250, weeks: 4 },
    { name: 'PS5', fullPrice: 500, bnplPrice: 500, weekly: 125, weeks: 4 },
    {
        name: 'Unexpected Expenses',
        fullPrice: 400,
        bnplPrice: 400,
        weekly: 100,
        weeks: 4,
        noBNPL: true,
    } as Purchase & { noBNPL: true }
];

interface Decision {
    purchase: Purchase;
    bought: boolean;
    bnpl: boolean;
}

const scenarios = [
    {
        id: 1,
        title: "Shoes",
        price: 200,
        weeklyPayment: 50,
        image: "/images/shoes.png",
        description: "At the night when Ashley received her first pay, she scrolls through instagram and sees an ad: Must-have sneakers for only $200! BNPL available: Just $50 x 4 payments."
    },
    {
        id: 2,
        title: "iPhone",
        price: 1000,
        weeklyPayment: 250,
        image: "/images/iphone.png",
        description: "Ashley was thinking of getting the new iPhone to replace her 3-year-old phone."
    },
    {
        id: 3,
        title: "PS5",
        price: 500,
        weeklyPayment: 125,
        image: "/images/ps5.png",
        description: "Ashley used BNPL for her sneakers and got a reward: more app promos! At the same time, all her friends were flexing their new PS5s and asking her to get one too so they could play together."
    },
    {
        id: 4,
        title: "Unexpected Expenses",
        price: 400,
        weeklyPayment: 100,
        image: "/images/crack.jpg",
        description: "Life happens! Ashley's iPhone screen cracked and needs repair ($300). She also realized she forgot to pay her utility bill last month ($100). These unexpected expenses need to be handled immediately."
    }
];

export default function BNPLExperience() {
    const [decisions, setDecisions] = useState<Decision[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [showIntermediateSummary, setShowIntermediateSummary] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);
    const [happinessScore, setHappinessScore] = useState(0);
    const initialBalance = 1000;

    const currentPurchase = purchases[currentStep];
    const isLastStep = currentStep === purchases.length - 1;
    const isFirstStep = currentStep === 0;

    const calculateTotalDebt = () => {
        return decisions.reduce((total, decision) => {
            if (decision.bought && decision.bnpl) {
                return total + (decision.purchase.weekly * decision.purchase.weeks);
            }
            return total;
        }, 0);
    };

    const calculateWeeklyDebt = () => {
        return decisions.reduce((total, decision) => {
            if (decision.bought && decision.bnpl) {
                return total + decision.purchase.weekly;
            }
            return total;
        }, 0);
    };

    const calculateRemainingBalance = () => {
        let balance = initialBalance;
        decisions.forEach(decision => {
            if (decision.bought && !decision.bnpl) {
                balance -= decision.purchase.fullPrice;
            }
        });
        return balance;
    };

    const calculateWeeklyBreakdown = (): number[] => {
        const weeks = 4;
        const breakdown = new Array(weeks).fill(0);

        decisions.forEach((decision) => {
            if (decision.bought && decision.bnpl && !decision.purchase.noBNPL) {
                for (let i = 0; i < decision.purchase.weeks; i++) {
                    breakdown[i] += decision.purchase.weekly;
                }
            }
        });

        return breakdown;
    };

    const calculateWeeklyBalance = (): number[] => {
        const weeks = 4;
        const balances = [];
        let currentBalance = initialBalance;

        // Subtract full price purchases at the start
        decisions.forEach((decision) => {
            if (decision.bought && !decision.bnpl) {
                currentBalance -= decision.purchase.fullPrice;
            }
        });

        // For each week, subtract BNPL payments
        for (let week = 0; week < weeks; week++) {
            const weeklyPayment = decisions.reduce((total, decision) => {
                if (decision.bought && decision.bnpl && !decision.purchase.noBNPL && week < decision.purchase.weeks) {
                    return total + decision.purchase.weekly;
                }
                return total;
            }, 0);

            currentBalance -= weeklyPayment;
            balances.push(currentBalance);
        }

        return balances;
    };

    const handleDecision = (bought: boolean, bnpl: boolean) => {
        const newDecisions = [...decisions, { purchase: currentPurchase, bought, bnpl }];
        setDecisions(newDecisions);
        if (bought) {
            setHappinessScore(prev => prev + 20);
        }
        setShowIntermediateSummary(true);
    };

    const handleContinue = () => {
        if (isLastStep) {
            setShowIntermediateSummary(false);
            setShowSummary(true);
        } else {
            setCurrentStep(currentStep + 1);
            setShowIntermediateSummary(false);
        }
    };

    const handleBack = () => {
        if (showSummary) {
            setShowSummary(false);
            setShowIntermediateSummary(true);
        } else if (showIntermediateSummary) {
            setShowIntermediateSummary(false);
            // Go back one step and remove the last decision
            const lastDecision = decisions[decisions.length - 1];
            if (lastDecision && lastDecision.bought) {
                setHappinessScore(prev => prev - 20);
            }
            setDecisions(prev => prev.slice(0, -1));
        } else if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
            const lastDecision = decisions[decisions.length - 1];
            if (lastDecision && lastDecision.bought) {
                setHappinessScore(prev => prev - 20);
            }
            setDecisions(prev => prev.slice(0, -1));
        }
    };

    const handleReset = () => {
        setDecisions([]);
        setCurrentStep(0);
        setShowSummary(false);
        setShowIntermediateSummary(false);
        setHappinessScore(0);
    };

    const handleScenarioSelect = (scenario: typeof scenarios[0]) => {
        setSelectedScenario(scenario);
        setCurrentStep(1);
    };

    const renderIntermediateSummary = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center mb-4 text-white">
                Impact of Your Decision
            </h3>

            <div className="bg-gray-700 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-white">Current Balance</p>
                        <p className="text-2xl font-semibold text-white">${calculateRemainingBalance()}</p>
                    </div>
                    <div>
                        <p className="text-white">Weekly Payments Due</p>
                        <p className="text-2xl font-semibold text-white">${calculateWeeklyDebt()}</p>
                    </div>
                    <div>
                        <p className="text-white">Total BNPL Debt</p>
                        <p className="text-2xl font-semibold text-white">${calculateTotalDebt()}</p>
                    </div>
                    <div>
                        <p className="text-white">Happiness Score</p>
                        <p className="text-2xl font-semibold text-yellow-400">⭐ {happinessScore}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 text-white">Your Decisions So Far</h4>
                    <div className="space-y-2">
                        {decisions.map((decision, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-600 rounded">
                                <span className="text-white">{decision.purchase.name}</span>
                                <span className="text-white">
                                    {decision.bought
                                        ? (decision.bnpl
                                            ? `BNPL ($${decision.purchase.weekly}/week)`
                                            : `Full Price ($${decision.purchase.fullPrice})`)
                                        : 'Not Purchased'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                        onClick={handleBack}
                        className="flex-1 px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-sm hover:bg-gray-600 transition-colors duration-200"
                    >
                        Back
                    </button>

                    <button
                        onClick={handleContinue}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-md hover:brightness-110 transition-all duration-200"
                    >
                        {isLastStep ? 'View Summary' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSummary = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center mb-6 text-white">Your Final Purchase Summary</h3>

            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white">Financial Overview</h4>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-white">Initial Balance</p>
                        <p className="text-2xl font-semibold text-white">${initialBalance}</p>
                    </div>
                    <div>
                        <p className="text-white">Remaining Balance</p>
                        <p className="text-2xl font-semibold text-white">${calculateRemainingBalance()}</p>
                    </div>
                    <div>
                        <p className="text-white">Weekly Payment Due</p>
                        <p className="text-2xl font-semibold text-white">${calculateWeeklyDebt()}</p>
                    </div>
                    <div>
                        <p className="text-white">Total BNPL Debt</p>
                        <p className="text-2xl font-semibold text-white">${calculateTotalDebt()}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-white">Final Happiness Score</p>
                        <p className="text-3xl font-bold text-yellow-400">⭐ {happinessScore}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {happinessScore === 0 ? "No purchases made yet" :
                             happinessScore === 20 ? "One purchase made" :
                             happinessScore === 40 ? "Two purchases made" :
                             happinessScore === 60 ? "Three purchases made" :
                             "All purchases made!"}
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4 text-white">BNPL Weekly Breakdown</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {calculateWeeklyBreakdown().map((amount, index) => (
                            <div key={index} className="bg-gray-600 p-4 rounded text-center">
                                <p className="text-white font-medium">Week {index + 1}</p>
                                <p className="text-xl font-bold text-blue-400">${amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4 text-white">Weekly Remaining Balance</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {calculateWeeklyBalance().map((balance, index) => (
                            <div key={index} className="bg-gray-600 p-4 rounded text-center">
                                <p className="text-white font-medium">Week {index + 1}</p>
                                <p className="text-xl font-bold text-green-400">${balance}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4 text-white">Your Purchase Decisions</h4>
                    <div className="space-y-2">
                        {decisions.map((decision, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-600 rounded">
                                <span className="text-white">{decision.purchase.name}</span>
                                <span className="text-white">
                                    {decision.bought
                                        ? (decision.bnpl
                                            ? `BNPL ($${decision.purchase.weekly}/week)`
                                            : `Full Price ($${decision.purchase.fullPrice})`)
                                        : 'Not Purchased'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button
                        onClick={handleBack}
                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-8 bg-black">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-white">BNPL Experience</h1>
                <h2 className="mt-4 text-xl font-semibold mb-4 text-white">Disposable Income: ${initialBalance}</h2>
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                    {!isFirstStep && (
                        <button
                            onClick={handleBack}
                            className="py-2 px-4 rounded-lg border-2 border-gray-500 hover:bg-gray-900 text-white"
                        >
                            Back
                        </button>
                    )}
                    {!showSummary && !showIntermediateSummary ? (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-center mb-4 text-white">
                                Decision {currentStep + 1} of {purchases.length}
                            </h3>
                            <div className="bg-gray-700 p-6 rounded-lg lg:flex gap-8">
                                <div className="w-full lg:w-1/2">
                                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
                                        <Image
                                            src={scenarios[currentStep].image}
                                            alt={scenarios[currentStep].title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="lg:w-1/2 w-full">
                                    <h4 className="text-xl font-semibold my-4 text-white">{currentPurchase.name}</h4>
                                    <div className="space-y-4">
                                        <p className="text-gray-300 italic mb-4">
                                            {scenarios[currentStep].description}
                                        </p>
                                        <div className="bg-gray-600 p-6 rounded-xl shadow-inner text-white space-y-3">
                                            <h4 className="text-lg font-semibold">Pricing Options</h4>

                                            <div className="flex items-center justify-between border-b border-gray-500 pb-2">
                                                <span>Full Price</span>
                                                <span className="font-bold text-green-400">${currentPurchase.fullPrice}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span>BNPL Plan</span>
                                                <span className="font-bold text-blue-400">
                                                    ${currentPurchase.weekly} weekly × {currentPurchase.weeks}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-4 w-full">
                                {!currentPurchase.noBNPL ? (
                                    <>
                                        <button
                                            onClick={() => handleDecision(true, true)}
                                            className="flex-1 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:brightness-110 transition"
                                        >
                                            Buy with BNPL
                                        </button>

                                        <button
                                            onClick={() => handleDecision(true, false)}
                                            className="flex-1 p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-md hover:brightness-110 transition"
                                        >
                                            Buy Full Price
                                        </button>

                                        <button
                                            onClick={() => handleDecision(false, false)}
                                            className="flex-1 p-4 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-semibold shadow-md hover:brightness-110 transition"
                                        >
                                            Don't Buy
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-full mb-4 p-4 bg-red-900/30 border border-red-500 rounded-xl">
                                            <p className="text-red-300 text-center">
                                                ⚠️ These are urgent expenses that must be paid immediately.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDecision(true, false)}
                                            className="w-full p-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-md hover:brightness-110 transition"
                                        >
                                            Pay Now
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : showIntermediateSummary ? (
                        renderIntermediateSummary()
                    ) : (
                        renderSummary()
                    )}
                </div>
            </div>
        </div>
    );
} 