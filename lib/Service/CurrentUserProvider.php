<?php
declare(strict_types=1);

namespace OCA\CustomProperties\Service;

use OCP\IUserSession;

class CurrentUserProvider
{
    /** @var IUserSession */
    private $userSession;

    public function __construct(IUserSession $userSession)
    {
        $this->userSession = $userSession;
    }

    public function getCurrentUserId(): ?string
    {
        $user = $this->userSession->getUser();
        if ($user !== null) {
            return $user->getUID();
        }

        if (class_exists('\OC_User')) {
            $legacyUserId = \OC_User::getUser();
            if (is_string($legacyUserId) && $legacyUserId !== '') {
                return $legacyUserId;
            }
        }

        return null;
    }
}
