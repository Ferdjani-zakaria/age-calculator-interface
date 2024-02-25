import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Date {
    day: string | number;
    month: string | number;
    year: string | number;
}

const Calculator: FC = () => {
    const [formState, setFormState] = useState<Date>({
        day: "",
        month: "",
        year: "",
    });
    const [ageState, setAgeState] = useState<Date>({
        day: "--",
        month: "--",
        year: "--",
    });
    const [todayState, setTodayState] = useState<Date>({
        day: 0,
        month: 0,
        year: 0,
    });

    const [error, setError] = useState<Date>({
        day: "",
        month: "",
        year: "",
    });

    useEffect(() => {
        const today = new Date();
        setTodayState({
            day: today.getDate(),
            month: today.getMonth() + 1,
            year: today.getFullYear(),
        });
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        errorCheck();
        const validity = checkValidity();
        if (validity) {
            setAgeState({
                day: validity.day,
                month: validity.month,
                year: validity.year,
            });
        }
    };

    const checkValidity = (): Date | false => {
        let yearDiff = Number(todayState.year) - Number(formState.year);
        let monthDiff = Number(todayState.month) - Number(formState.month);
        if (monthDiff < 0) {
            yearDiff--;
            monthDiff += 12;
        }
        let dayDiff = Number(todayState.day) - Number(formState.day);
        if (dayDiff < 0) {
            monthDiff--;
            dayDiff += new Date(
                Number(formState.year),
                Number(formState.month) - 1,
                0
            ).getDate();
        }
        if (yearDiff < 0 || monthDiff < 0 || dayDiff < 0) return false;
        const result = {
            day: dayDiff,
            month: monthDiff,
            year: yearDiff,
        };
        return result;
    };

    const errorCheck = (): void => {
        setError(() => ({
            year: !formState.year
                ? "This field is required"
                : formState.year > todayState.year
                ? "Must be in the past"
                : "",
            month: !formState.month
                ? "This field is required"
                : Number(formState.month) > 12 || Number(formState.month) < 0
                ? "Must be a valid month"
                : "",
            day: !formState.day
                ? "This field is required"
                : (!formState.month &&
                      (Number(formState.day) > 31 || Number(formState.day) < 0)) ||
                  isNaN(
                      new Date(
                          `${formState.year}-${formState.month}-${formState.day}`
                      ).getTime()
                  )
                ? "Must be a valid day"
                : "",
        }));
    };

    return (
        <div className="calculatorContainer">
            <form className="formContainer" onSubmit={handleSubmit}>
                <div className={error.day ? "error" : ""}>
                    <label htmlFor="day">DAY</label>
                    <input
                        type="number"
                        placeholder="00"
                        id="day"
                        value={formState.day}
                        onChange={handleChange}
                    />
                    {error.day && <p className="errorMsg">{error.day}</p>}
                </div>
                <div className={error.month ? "error" : ""}>
                    <label htmlFor="month">MONTH</label>
                    <input
                        type="number"
                        placeholder="00"
                        id="month"
                        value={formState.month}
                        onChange={handleChange}
                    />
                    {error.month && <p className="errorMsg">{error.month}</p>}
                </div>
                <div className={error.year ? "error" : ""}>
                    <label htmlFor="year">YEAR</label>
                    <input
                        type="number"
                        placeholder="0000"
                        id="year"
                        value={formState.year}
                        onChange={handleChange}
                    />
                    {error.year && <p className="errorMsg">{error.year}</p>}
                </div>
                <button className="submitBtn" type="submit">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="46"
                        height="44"
                        viewBox="0 0 46 44"
                    >
                        <g fill="none" stroke="#FFF" stroke-width="2">
                            <path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44" />
                        </g>
                    </svg>
                </button>
            </form>
            <div className="ageDisplay">
                <p>
                    <span>{ageState.year}</span> years
                </p>
                <p>
                    <span>{ageState.month}</span> months
                </p>
                <p>
                    <span>{ageState.day}</span> days
                </p>
            </div>
        </div>
    );
};

export default Calculator;
