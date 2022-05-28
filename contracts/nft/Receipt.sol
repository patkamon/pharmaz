pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Prescription.sol";

contract Receipt is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public owner;
    Prescription public prescription;

    constructor(address payable _prescription) ERC721("Receipt", "RCP") {
        // only owner will be able to do some task.
        prescription = Prescription(_prescription);
    }

    function create(uint256 tokenId, string memory tokenURI)
        public
        returns (uint256)
    {
        // take prescription
        ERC721(prescription).transferFrom(msg.sender, address(this), tokenId);

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // mint receipt and send to patient
        _mint(msg.sender, newItemId);

        // set tokenURI for patient
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
