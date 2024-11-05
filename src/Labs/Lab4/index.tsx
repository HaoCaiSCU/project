import React from "react";
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import EventObject from "./EventObject";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import ReduxExamples from "./ReduxExamples";

export default function Lab4() {
    function sayHello() {
        alert("Hello");
    }

    return (
        <div className="container">
            <div id="wd-click-event-section">
                <ClickEvent />
            </div>

            <div id="wd-passing-data-on-event-section">
                <PassingDataOnEvent />
            </div>

            <div id="wd-passing-functions-section">
                <PassingFunctions theFunction={sayHello} />
            </div>

            <div id="wd-event-object-section">
                <EventObject />
            </div>

            <div id="wd-counter-section">
                <Counter />
            </div>

            <div id="wd-boolean-state-section">
                <BooleanStateVariables />
            </div>

            <div id="wd-string-state-section">
                <StringStateVariables />
            </div>

            <div id="wd-date-state-section">
                <DateStateVariable />
            </div>

            <div id="wd-object-state-section">
                <ObjectStateVariable />
            </div>

            <div id="wd-array-state-section">
        <ArrayStateVariable />
      </div>

      <div id="wd-parent-state-section">
        <ParentStateComponent />
      </div>
      <div id="wd-redux-examples">
      <ReduxExamples />
      </div>

        </div>
    );
}
