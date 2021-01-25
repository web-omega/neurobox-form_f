import React from "react";
import NumberField from "../../neuro_cloud/src/components/configuration/common/settingsForm/fields/NumberField";
import SliderField from "../../neuro_cloud/src/components/configuration/common/settingsForm/fields/SliderField";
import LinesAreasCanvasField from "../../neuro_cloud/src/components/configuration/common/settingsForm/fields/LinesAreasCanvasField";
import ArrowAreasCanvasField from "../../neuro_cloud/src/components/configuration/common/settingsForm/fields/ArrowAreasCanvasField";
import SelectField from "../../neuro_cloud/src/components/configuration/common/settingsForm/fields/SelectField";
import RangeField from "../../neuro_cloud/src/components/configuration/common/settingsForm/fields/RangeField";

export function renderFormField(field) {
    switch (field.type) {
        case "number": return <NumberField {...field} code={field.key}/>;
        case "slider": return <SliderField {...field} code={field.key}/>;
        case "lines_areas_canvas": return <LinesAreasCanvasField {...field} code={field.key}/>;
        case "arrow_areas_canvas": return <ArrowAreasCanvasField {...field} code={field.key}/>;
        case "select": return <SelectField {...field} code={field.key}/>;
        case "range": return <RangeField {...field} code={field.key}/>;
        default: return null;
    }
}