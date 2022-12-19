import './Språkhjelp.css'
import {Accordion, Alert} from "@navikt/ds-react";
import {
    LongParagraphs,
    LongSentences,
    LongWords,
    DublicateWords,
    GammelnavskDictionary,
    NrkDictionaries,
    AvløserordDictionary,
    CommaCheck,
    PersonalData,
    Tools
} from "./analysis/index"

function Resultbox(props) {
    let value = props.content;
    return (
        <>
            {value.length == 0 ? (
                    <Alert variant="info">Sett inn tekst for å få opp resultater.</Alert>) :
                (
                    <>
                        <Accordion className="språkhjelp-navds-accordion">
                            <LongParagraphs content={value}/>
                            <LongSentences content={value}/>
                            <LongWords content={value}/>
                            <DublicateWords content={value}/>
                            <GammelnavskDictionary content={value}/>
                            <NrkDictionaries content={value}/>
                            <AvløserordDictionary content={value}/>
                            <CommaCheck content={value}/>
                            <PersonalData content={value}/>
                            <Tools content={value}/>
                        </Accordion>
                    </>
                )}
        </>
    );
}

export default Resultbox;