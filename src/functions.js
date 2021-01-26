import React from "react";
import NumberField from "./form/fields/NumberField";
import SliderField from "./form/fields/SliderField";
import LinesAreasCanvasField from "./form/fields/LinesAreasCanvasField";
import ArrowAreasCanvasField from "./form/fields/ArrowAreasCanvasField";
import SelectField from "./form/fields/SelectField";
import RangeField from "./form/fields/RangeField";

export function renderFormField(field) {
    switch (field.type) {
        case "number": return <NumberField {...field} code={field.key}/>;
        case "slider": return <SliderField {...field} code={field.key}/>;
        case "lines_areas_canvas": return <LinesAreasCanvasField {...field} code={field.key}/>;
        case "arrow_areas_canvas": return <ArrowAreasCanvasField {...field} code={field.key} />;
        case "select": return <SelectField {...field} code={field.key}/>;
        case "range": return <RangeField {...field} code={field.key}/>;
        default: return null;
    }
}
