import React, { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const AudienceLocation = ({ name, label, required = false }) => {
    const { register, formState: { errors }, setValue, trigger } = useFormContext();
    const [searchTerm, setSearchTerm] = useState('');

    const [citySearchTerm, setCitySearchTerm] = useState('');
    const [countrySearchTerm, setCountrySearchTerm] = useState('');


    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);

    // Sample data - in real app, you'd fetch this from an API
    const cities = [
        'Hyderabad', 'Pune', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
        'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
        'New York', 'London', 'Dubai', 'Toronto', 'Sydney', 'Singapore', 'Tokyo'
    ];

    const countries = [
        'India', 'Pakistan', 'United Kingdom', 'United States', 'Canada',
        'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'UAE', 'Saudi Arabia'
    ];

    // Filter locations based on search
    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(citySearchTerm.toLowerCase())
    );

    const filteredCountries = countries.filter(country =>
        country.toLowerCase().includes(countrySearchTerm.toLowerCase())
    );

    // Watch form data
    const watchedCities = useWatch({ name: 'audienceByCity' }) || [];
    const watchedCountries = useWatch({ name: 'audienceByCountry' }) || [];

    // Calculate total percentage
    const totalCityPercentage = [...watchedCities].reduce((sum, item) => {
        return sum + (parseInt(item?.value) || 0);
    }, 0);
    const totalCountryPercentage = [...watchedCountries].reduce((sum, item) => {
        return sum + (parseInt(item?.value) || 0);
    }, 0);

    const isCityOverLimit = totalCityPercentage > 100;
    const isCountryOverLimit = totalCountryPercentage > 100;

    console.log({totalCityPercentage, totalCountryPercentage, isCityOverLimit, isCountryOverLimit});
    

    // Toggle location selection
    const toggleLocationSelection = (location, type) => {
        if (type === 'city') {
            const exists = selectedCities.find(city => city.name === location);
            if (exists) {
                // Remove city
                const updatedCities = selectedCities.filter(city => city.name !== location);
                setSelectedCities(updatedCities);
                setValue('audienceByCity', updatedCities);
            } else {
                // Add city
                const newCity = { category: 'city', name: location, value: 0 };
                const updatedCities = [...selectedCities, newCity];
                setSelectedCities(updatedCities);
                setValue('audienceByCity', updatedCities);
            }
        } else {
            const exists = selectedCountries.find(country => country.name === location);
            if (exists) {
                // Remove country
                const updatedCountries = selectedCountries.filter(country => country.name !== location);
                setSelectedCountries(updatedCountries);
                setValue('audienceByCountry', updatedCountries);
            } else {
                // Add country
                const newCountry = { category: 'country', name: location, value: 0 };
                const updatedCountries = [...selectedCountries, newCountry];
                setSelectedCountries(updatedCountries);
                setValue('audienceByCountry', updatedCountries);
            }
        }
        setSearchTerm('');
    };

    // Update percentage for a location
    const updatePercentage = (location, type, value) => {
        if (type === 'city') {
            const updatedCities = selectedCities.map(city =>
                city.name === location ? { ...city, value: parseInt(value) || 0 } : city
            );
            setSelectedCities(updatedCities);
            setValue('audienceByCity', updatedCities);
        } else {
            const updatedCountries = selectedCountries.map(country =>
                country.name === location ? { ...country, value: parseInt(value) || 0 } : country
            );
            setSelectedCountries(updatedCountries);
            setValue('audienceByCountry', updatedCountries);
        }
        setTimeout(() => trigger(['audienceByCity', 'audienceByCountry']), 0);
    };

    // Check if location is selected
    const isLocationSelected = (location, type) => {
        if (type === 'city') {
            return selectedCities.some(city => city.name === location);
        } else {
            return selectedCountries.some(country => country.name === location);
        }
    };

    // Initialize form data
    useEffect(() => {
        if (watchedCities.length > 0) {
            setSelectedCities(watchedCities);
        }
        if (watchedCountries.length > 0) {
            setSelectedCountries(watchedCountries);
        }
    }, []);

    return (
        <div className="space-y-4">
            {label && (
                <label className="block text-lg font-semibold mb-4">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* City Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search cities"
                    value={citySearchTerm}
                    onChange={(e) => setCitySearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
            </div>

            {/* Search Results */}
            {citySearchTerm && (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                    {/* Cities Section */}
                    {filteredCities.length > 0 && (
                        <div>
                            <div className="px-3 py-2 bg-gray-100 font-medium text-sm text-gray-700 border-b">
                                Cities
                            </div>
                            {filteredCities.map((city) => (
                                <button
                                    key={`city-${city}`}
                                    type="button"
                                    onClick={() => toggleLocationSelection(city, 'city')}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isLocationSelected(city, 'city')}
                                        onChange={() => { }}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}


                    {filteredCities.length === 0 && (
                        <div className="px-3 py-2 text-gray-500">No results found</div>
                    )}
                </div>
            )}

            {/* Selected Cities */}
            {selectedCities.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Selected Cities:</h4>
                    {selectedCities.map((city) => (
                        <div key={`selected-city-${city.name}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => toggleLocationSelection(city.name, 'city')}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="font-medium">{city.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`border px-3 py-1 rounded-md flex items-center gap-2 ${isCityOverLimit ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={city.value || ''}
                                        onChange={(e) => updatePercentage(city.name, 'city', e.target.value)}
                                        className="outline-none w-12 text-right bg-transparent"
                                        placeholder="0"
                                    />
                                    <span className="text-gray-500 text-sm">%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Total percentage display */}
            {(selectedCities.length > 0) && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-semibold text-sm">Total:</span>
                    <span className={`font-bold text-lg ${isCityOverLimit ? 'text-red-500' :
                        totalCityPercentage === 100 ? 'text-green-600' :
                            'text-gray-700'
                        }`}>
                        {totalCityPercentage}%
                    </span>
                </div>
            )}

            {/* Error messages */}
            {isCityOverLimit && (
                <p className="text-sm text-red-500">
                    Total percentage cannot exceed 100% (currently {totalCityPercentage}%)
                </p>
            )}


            {/* City Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search cities"
                    value={countrySearchTerm}
                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
            </div>
            {/* Countries Search Results */}
            {countrySearchTerm && (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">

                    {filteredCountries.length > 0 && (
                        <div>
                            <div className="px-3 py-2 bg-gray-100 font-medium text-sm text-gray-700 border-b">
                                Countries
                            </div>
                            {filteredCountries.map((country) => (
                                <button
                                    key={`country-${country}`}
                                    type="button"
                                    onClick={() => toggleLocationSelection(country, 'country')}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isLocationSelected(country, 'country')}
                                        onChange={() => { }}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    {country}
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredCountries.length === 0 && (
                        <div className="px-3 py-2 text-gray-500">No results found</div>
                    )}
                </div>
            )}
            {/* Selected Countries */}
            {selectedCountries.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Selected Countries:</h4>
                    {selectedCountries.map((country) => (
                        <div key={`selected-country-${country.name}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => toggleLocationSelection(country.name, 'country')}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="font-medium">{country.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`border px-3 py-1 rounded-md flex items-center gap-2 ${isCountryOverLimit ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={country.value || ''}
                                        onChange={(e) => updatePercentage(country.name, 'country', e.target.value)}
                                        className="outline-none w-12 text-right bg-transparent"
                                        placeholder="0"
                                    />
                                    <span className="text-gray-500 text-sm">%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Total percentage display */}
            {(selectedCountries.length > 0) && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-semibold text-sm">Total:</span>
                    <span className={`font-bold text-lg ${isCountryOverLimit ? 'text-red-500' :
                        totalCountryPercentage === 100 ? 'text-green-600' :
                            'text-gray-700'
                        }`}>
                        {totalCountryPercentage}%
                    </span>
                </div>
            )}

            {/* Error messages */}
            {isCountryOverLimit && (
                <p className="text-sm text-red-500">
                    Total percentage cannot exceed 100% (currently {totalCountryPercentage}%)
                </p>
            )}

            {/* Form validation errors */}
            {errors.audienceByCity && (
                <p className="text-sm text-red-500">{errors.audienceByCity.message}</p>
            )}
            {errors.audienceByCountry && (
                <p className="text-sm text-red-500">{errors.audienceByCountry.message}</p>
            )}

            {/* Hidden inputs for form validation */}
            <input
                type="hidden"
                {...register('audienceByCity', {
                    // validate: {
                    //     totalPercentage: () => {
                    //         const total = [...selectedCities, ...selectedCountries].reduce((sum, item) => sum + (parseInt(item?.value) || 0), 0);
                    //         if (total > 100) return 'Total percentage cannot exceed 100%';
                    //         return true;
                    //     }
                    // }
                })}
            />

            <input
                type="hidden"
                {...register('audienceByCountry', {
                    required: required ? 'Please select at least one location' : false,
                    // validate: {
                    //     hasSelection: () => {
                    //         if (required && selectedCities.length === 0 && selectedCountries.length === 0) {
                    //             return 'Please select at least one city or country';
                    //         }
                    //         return true;
                    //     }
                    // }
                })}
            />
        </div>
    );
};

export default AudienceLocation;