This package allows you to run a local (development) setup of relaychain and Statemint parachain.

#### 1. Build a polkadot binary

First, clone the repo:
```shell
git clone https://github.com/paritytech/polkadot
```
Adjust the Westend epoch time for faster parachain onboarding. In the file `runtime/westend/src/constants.rs` change the value of `EPOCH_DURATION_IN_SLOTS`,
for example to 1 minute:
```rust
pub const EPOCH_DURATION_IN_SLOTS: BlockNumber = 1 * MINUTES;
```
Then build the binary:
```shell
cargo build --release
```
#### 2. Build cumulus binary
```shell
git clone https://github.com/paritytech/cumulus
cd cumulus
cargo build --release
```
#### 3. Link the binaries
```shell
ln -s /your/polkadot/dir/target/release/polkadot ./bin 
ln -s /your/cumulus/dir/target/release/polkadot-collator ./bin

```
#### 4. Run `polkadot-launch`
```shell
rushx run
```
Wait for message "🚀 POLKADOT LAUNCH COMPLETE 🚀".

#### 5. Wait for epoch change 
The Westmint parachain will start authoring blocks after the first epoch change.
Open polkadot-js Apps and connect to one of the local relay chain nodes (eg. `127.0.0.0.1:9444`).
Open `Network/Parachains` and verify that block numbers are updated for parachain `1000`.
