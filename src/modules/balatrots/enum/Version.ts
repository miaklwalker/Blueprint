export class Version {
    static readonly v_100n = new Version(10014);
    static readonly v_101c = new Version(10103);
    static readonly v_101f = new Version(10106);

    private constructor(private readonly version: number) { }

    public getVersion(): number {
        return this.version;
    }

    public static values(): Version[] {
        return [
            Version.v_100n,
            Version.v_101c,
            Version.v_101f
        ];
    }
}