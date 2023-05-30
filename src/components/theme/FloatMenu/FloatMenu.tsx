import {BodyLong, Button, Heading, Modal, Textarea, CheckboxGroup, Checkbox, ReadMore} from "@navikt/ds-react";
import {useState} from "react";
import {Link} from "@navikt/ds-react";
import {BubbleMenu} from "@tiptap/react";
import {Lix, Privacy, Apertium, Gpt} from "./tools/index";

function FloatMenu(props) {
    let editor = props.editor
    let higlighetdwords = props.higlighetdwords

    let higlighetdwordsModified = higlighetdwords.replaceAll("\n", "%20%20");
    higlighetdwordsModified = higlighetdwordsModified.replaceAll("%20%20%20%20", "%20%20");
    const dictionaryLink = "https://ordbokene.no/bm,nn/search?q=" + higlighetdwords.toLowerCase()
    const ngramLink = "https://api.nb.no/dhlab/nb_ngram/#ngram/query?terms=" + higlighetdwords.toLowerCase() + "&lang=all&case_sens=0&freq=rel&corpus=avis"
    const datanorgeLink = "https://data.norge.no/concepts?q=" + higlighetdwords.toLowerCase()
    const analyzeLink = "https://navikt.github.io/spraksjekk/?q=" + higlighetdwordsModified

    const [mySnippet, setMySnippet] = useState("")
    const [openapertium, setOpenapertium] = useState(false);
    const [opengpt, setOpengpt] = useState(false);

    function apertiummodal() {
        event.preventDefault()
        setOpenapertium(true)
        setMySnippet(higlighetdwords)
    }

    function gptmodal() {
        event.preventDefault()
        setOpengpt(true)
        setMySnippet(higlighetdwords)
    }

    // @ts-ignore
    return (
        <>
            <BubbleMenu tippyOptions={{
                aria: {
                    content: 'auto',
                    expanded: false,
                },
            }} editor={editor}>
                {!higlighetdwords.match(/[?]+|[!]+|[.]+|[,]+|[:]/g) ? (
                    <>
                        <Link className="navds-button navds-button--secondary navds-button--small navds-label--small"
                              target="_blank" style={{textDecoration: "none"}} href={dictionaryLink}>Ordbøkene</Link>
                        <Link className="navds-button navds-button--secondary navds-button--small navds-label--small"
                              style={{marginLeft: '-1px', textDecoration: "none"}} target="_blank"
                              href={ngramLink}>N-gram</Link>
                        <Link className="navds-button navds-button--secondary navds-button--small navds-label--small"
                              style={{marginLeft: '-1px', textDecoration: "none"}} target="_blank"
                              href={datanorgeLink}>Begrepskatalog</Link>
                    </>
                ) : (<>{higlighetdwords.match(/[?]+|[!]+|[.]/g) && (
                    <>
                        <Link
                            className="navds-button navds-button--secondary navds-button--small navds-label--small språkhjelp-nounderline"
                            style={{textDecoration: "none"}} target="_blank" href={analyzeLink}><Lix
                            content={higlighetdwords}/></Link>
                        <button onClick={() => apertiummodal()}
                                className="navds-button navds-button--secondary navds-button--small navds-label--small språkhjelp-nounderline"
                                style={{textDecoration: "none"}}>Oversett
                        </button>
                        <button onClick={() => gptmodal()}
                                className="navds-button navds-button--secondary navds-button--small navds-label--small språkhjelp-nounderline"
                                style={{textDecoration: "none"}}>Tilpass tekst
                        </button>
                    </>
                )}</>)}
            </BubbleMenu>

            <Apertium mySnippet={mySnippet} open={openapertium}/>
            <Gpt mySnippet={mySnippet} open={opengpt}/>
        </>
    );
}

export default FloatMenu;