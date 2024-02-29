export class CoinPackageResponse  {
    public active: boolean
    public price: number
    public coinGain: number
    public coinBonusIndicator: number
    public tier: number
    public tag: [{id: number, label: string}]
}