
export const extractFlagValueSystemMessage = `You will be given a website content from which you should extract a value from a text in a following pattern:

{{FLG:NAZWAFLAGI}}

Example 1:

        <dt class="old">Version 0.12.1</dt>
        <dd>- added some extra security</dd>
        <dt class="old">Version 0.12.1</dt>
        <dd>- added some extra security</dd>
        </dl>
        <h2 style="background:#f4ffaa;font-family:monospace">{{FLG:FIRMWARE}}</h2>
    </div>
</div>

Answer: FIRMWARE
`